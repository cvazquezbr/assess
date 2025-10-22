import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with questionnaire-specific fields.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * OTP verification table for phone-based authentication
 */
export const otpVerifications = mysqlTable("otpVerifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  attempts: int("attempts").default(0).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type OtpVerification = typeof otpVerifications.$inferSelect;
export type InsertOtpVerification = typeof otpVerifications.$inferInsert;

/**
 * Questionnaire responses table
 * Stores all responses from users for the campaign questionnaire
 */
export const questionnaireResponses = mysqlTable("questionnaireResponses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  
  // Section 1: Business Context and Solution
  businessPurpose: text("businessPurpose"),
  productStage: varchar("productStage", { length: 50 }),
  activeUsers: varchar("activeUsers", { length: 50 }),
  sixMonthGoals: json("sixMonthGoals"), // Array of selected goals
  hasDeadlineOrInvestment: boolean("hasDeadlineOrInvestment"),
  deadlineOrInvestmentDetails: text("deadlineOrInvestmentDetails"),
  
  // Section 2: Organization and Team
  teamStructure: varchar("teamStructure", { length: 50 }),
  totalProfessionals: int("totalProfessionals"),
  teamProfiles: json("teamProfiles"), // Array of {role, quantity}
  dedicationType: varchar("dedicationType", { length: 50 }),
  fattoRole: varchar("fattoRole", { length: 50 }),
  
  // Section 3: Scope and Development Cycle
  fattoEntryPoint: varchar("fattoEntryPoint", { length: 50 }),
  requirementsProcess: varchar("requirementsProcess", { length: 50 }),
  plannedFeatures: int("plannedFeatures"),
  validationMethod: varchar("validationMethod", { length: 50 }),
  
  // Section 4: Technology and Architecture
  mainTechnologies: text("mainTechnologies"),
  systemsCount: int("systemsCount"),
  architectureModel: varchar("architectureModel", { length: 50 }),
  architectureAutonomy: varchar("architectureAutonomy", { length: 50 }),
  externalIntegrations: int("externalIntegrations"),
  hasCriticalIntegrations: boolean("hasCriticalIntegrations"),
  criticalIntegrationsDetails: text("criticalIntegrationsDetails"),
  
  // Section 5: DevOps, Deliveries and Environments
  environments: json("environments"), // Array of selected environments
  environmentsCount: int("environmentsCount"),
  provisioningResponsible: varchar("provisioningResponsible", { length: 50 }),
  cicdImplemented: varchar("cicdImplemented", { length: 50 }),
  deliveryTools: json("deliveryTools"), // Array of selected tools
  monthlyDeploys: int("monthlyDeploys"),
  fattoDeployResponsibility: varchar("fattoDeployResponsibility", { length: 50 }),
  
  // Section 6: Support, Maintenance and Evolution
  fattoSustainment: boolean("fattoSustainment"),
  monthlyIncidents: int("monthlyIncidents"),
  currentSupport: varchar("currentSupport", { length: 50 }),
  slaDuration: varchar("slaDuration", { length: 50 }),
  releaseRoadmap: varchar("releaseRoadmap", { length: 50 }),
  
  // Section 7: Governance, Communication and Processes
  meetingFrequency: varchar("meetingFrequency", { length: 50 }),
  regularMeetingParticipants: int("regularMeetingParticipants"),
  hasProductOwner: boolean("hasProductOwner"),
  backlogTools: varchar("backlogTools", { length: 50 }),
  decisionFormalization: varchar("decisionFormalization", { length: 50 }),
  
  // Section 8: Commercial Expectations and Contract
  contractModel: varchar("contractModel", { length: 50 }),
  billingType: varchar("billingType", { length: 50 }),
  startTimeline: varchar("startTimeline", { length: 50 }),
  budgetRange: varchar("budgetRange", { length: 50 }),
  requiredProfessionals: int("requiredProfessionals"),
  
  // Section 9: Risks and Previous Learning
  previousVendors: boolean("previousVendors"),
  vendorCount: int("vendorCount"),
  mainDifficulties: json("mainDifficulties"), // Array of selected difficulties
  lessonsLearned: text("lessonsLearned"),
  
  // Section 10: Next Steps and FATTO Involvement
  expectedFattoRole: json("expectedFattoRole"), // Array of selected roles
  prioritaryDeliverables: json("prioritaryDeliverables"), // Array of selected deliverables
  shortTermDeliverables: int("shortTermDeliverables"),
  expectedFattoAutonomy: varchar("expectedFattoAutonomy", { length: 50 }),
  
  // Section 11: Synthesis and Observations
  analystNotes: text("analystNotes"),
  
  // Metadata
  currentStep: int("currentStep").default(0).notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type QuestionnaireResponse = typeof questionnaireResponses.$inferSelect;
export type InsertQuestionnaireResponse = typeof questionnaireResponses.$inferInsert;

