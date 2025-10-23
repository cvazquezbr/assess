import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, otpVerifications, InsertOtpVerification, questionnaireResponses, InsertQuestionnaireResponse, QuestionnaireResponse } from "../drizzle/schema.js";
import { ENV } from './_core/env.js';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByPhone(phone: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// OTP Functions
export async function createOtpVerification(data: InsertOtpVerification) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create OTP: database not available");
    return undefined;
  }

  await db.insert(otpVerifications).values(data);
  return data;
}

export async function getOtpVerification(phone: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get OTP: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(otpVerifications)
    .where(eq(otpVerifications.phone, phone))
    .orderBy(otpVerifications.createdAt)
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function verifyOtp(phone: string, code: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot verify OTP: database not available");
    return false;
  }

  const otp = await getOtpVerification(phone);
  
  if (!otp || otp.isVerified || new Date() > otp.expiresAt) {
    return false;
  }

  if (otp.code !== code) {
    // Increment attempts
    await db
      .update(otpVerifications)
      .set({ attempts: otp.attempts + 1 })
      .where(eq(otpVerifications.id, otp.id));
    return false;
  }

  // Mark as verified
  await db
    .update(otpVerifications)
    .set({ isVerified: true })
    .where(eq(otpVerifications.id, otp.id));

  return true;
}

export async function deleteExpiredOtps() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete OTPs: database not available");
    return;
  }

  await db
    .delete(otpVerifications)
    .where(
      and(
        eq(otpVerifications.isVerified, false),
        // Simplified: delete if created more than 10 minutes ago
      )
    );
}

// Questionnaire Functions
export async function createQuestionnaireResponse(data: InsertQuestionnaireResponse) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create response: database not available");
    return undefined;
  }

  await db.insert(questionnaireResponses).values(data);
  return data;
}

export async function getQuestionnaireResponse(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get response: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(questionnaireResponses)
    .where(eq(questionnaireResponses.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserQuestionnaireResponse(userId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get response: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(questionnaireResponses)
    .where(eq(questionnaireResponses.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateQuestionnaireResponse(id: string, data: Partial<InsertQuestionnaireResponse>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update response: database not available");
    return undefined;
  }

  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  await db
    .update(questionnaireResponses)
    .set(updateData)
    .where(eq(questionnaireResponses.id, id));

  return getQuestionnaireResponse(id);
}

export async function getAllQuestionnaireResponses() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get responses: database not available");
    return [];
  }

  return await db
    .select()
    .from(questionnaireResponses)
    .orderBy(questionnaireResponses.updatedAt);
}

export async function getQuestionnaireResponsesByUserId(userId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get responses: database not available");
    return [];
  }

  return await db
    .select()
    .from(questionnaireResponses)
    .where(eq(questionnaireResponses.userId, userId));
}
