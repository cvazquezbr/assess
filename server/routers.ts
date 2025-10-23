import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { 
  createOtpVerification, 
  verifyOtp, 
  getUserByPhone, 
  upsertUser,
  getUser,
  createQuestionnaireResponse,
  getUserQuestionnaireResponse,
  updateQuestionnaireResponse,
  getAllQuestionnaireResponses,
  getQuestionnaireResponse,
} from "./db";
import type { Request, Response } from "express";

// Helper to generate 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to send OTP (placeholder - integrate with SMS service)
async function sendOtpSms(phone: string, code: string): Promise<boolean> {
  // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
  console.log(`[OTP] Sending code ${code} to ${phone}`);
  // For development, you can log or return true
  return true;
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req as Request);
      (ctx.res as Response).clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    // Request OTP
    requestOtp: publicProcedure
      .input(z.object({
        phone: z.string().min(10, "Phone number must be at least 10 digits"),
        email: z.string().email().optional(),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const otp = generateOtp();
          const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

          // Check if user exists
          let user = await getUserByPhone(input.phone);
          
          if (!user) {
            // Create new user
            const userId = randomUUID();
            await upsertUser({
              id: userId,
              phone: input.phone,
              email: input.email,
              name: input.name,
              loginMethod: "otp",
            });
          }

          // Create OTP verification
          await createOtpVerification({
            id: randomUUID(),
            phone: input.phone,
            code: otp,
            isVerified: false,
            attempts: 0,
            expiresAt,
          });

          // Send OTP via SMS
          const sent = await sendOtpSms(input.phone, otp);

          if (!sent) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to send OTP",
            });
          }

          return {
            success: true,
            message: "OTP sent successfully",
            expiresIn: 600, // 10 minutes in seconds
          };
        } catch (error) {
          console.error("[OTP] Error requesting OTP:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to request OTP",
          });
        }
      }),

    // Verify OTP and create session
    verifyOtp: publicProcedure
      .input(z.object({
        phone: z.string().min(10),
        code: z.string().length(6),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const verified = await verifyOtp(input.phone, input.code);

          if (!verified) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid or expired OTP",
            });
          }

          // Get or create user
          let user = await getUserByPhone(input.phone);
          if (!user) {
            const userId = randomUUID();
            await upsertUser({
              id: userId,
              phone: input.phone,
              loginMethod: "otp",
            });
            user = await getUser(userId);
          }

          if (!user) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create user session",
            });
          }

          // Set session cookie (handled by context)
          const cookieOptions = getSessionCookieOptions(ctx.req as Request);
          (ctx.res as Response).cookie(COOKIE_NAME, user.id, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          } as any);

          return {
            success: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
            },
          };
        } catch (error) {
          console.error("[OTP] Error verifying OTP:", error);
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to verify OTP",
          });
        }
      }),
  }),

  questionnaire: router({
    // Get or create user's questionnaire response
    getOrCreate: protectedProcedure.query(async ({ ctx }) => {
      try {
        let response = await getUserQuestionnaireResponse(ctx.user.id);

        if (!response) {
          // Create new response
          const id = randomUUID();
          await createQuestionnaireResponse({
            id,
            userId: ctx.user.id,
            currentStep: 0,
            isCompleted: false,
          });
          response = await getQuestionnaireResponse(id);
        }

        return response;
      } catch (error) {
        console.error("[Questionnaire] Error getting response:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get questionnaire",
        });
      }
    }),

    // Get specific questionnaire response
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        try {
          const response = await getQuestionnaireResponse(input.id);

          if (!response) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Questionnaire not found",
            });
          }

          // Check authorization (user can view own, admin can view all)
          if (response.userId !== ctx.user.id && ctx.user.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Not authorized to view this questionnaire",
            });
          }

          return response;
        } catch (error) {
          console.error("[Questionnaire] Error getting response:", error);
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get questionnaire",
          });
        }
      }),

    // Update questionnaire response
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        data: z.record(z.string(), z.any()),
        currentStep: z.number().optional(),
        isCompleted: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const response = await getQuestionnaireResponse(input.id);

          if (!response) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Questionnaire not found",
            });
          }

          // Check authorization
          if (response.userId !== ctx.user.id && ctx.user.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Not authorized to update this questionnaire",
            });
          }

          const updateData = {
            ...input.data,
            currentStep: input.currentStep ?? response.currentStep,
            isCompleted: input.isCompleted ?? response.isCompleted,
            completedAt: input.isCompleted ? new Date() : response.completedAt,
          };

          const updated = await updateQuestionnaireResponse(input.id, updateData);

          return updated;
        } catch (error) {
          console.error("[Questionnaire] Error updating response:", error);
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update questionnaire",
          });
        }
      }),

    // List all questionnaires (admin only)
    listAll: protectedProcedure.query(async ({ ctx }) => {
      try {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can list all questionnaires",
          });
        }

        return await getAllQuestionnaireResponses();
      } catch (error) {
        console.error("[Questionnaire] Error listing responses:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list questionnaires",
        });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
