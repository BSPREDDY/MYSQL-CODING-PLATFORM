// import {
// 	pgTable,
// 	uuid,
// 	text,
// 	varchar,
// 	timestamp,
// 	pgEnum,
// 	boolean,
// 	integer,
// 	primaryKey,
// 	doublePrecision,
// } from "drizzle-orm/pg-core";
// import { sql } from "drizzle-orm";
// import type { InferInsertModel } from "drizzle-orm";

// // Enums
// export const userRole = pgEnum("user_role", ["admin", "user"]);
// export const difficulty = pgEnum("difficulty", ["easy", "medium", "hard"]);
// export const submissionResult = pgEnum("submission_result", [
// 	"AC",
// 	"Rejected",
// 	"Pending",
// ]);
// export const testCaseResult = pgEnum("test_case_result", [
// 	"AC",
// 	"Fail",
// 	"TLE",
// 	"CompilationError",
// 	"Pending",
// ]);
// export const contestStatus = pgEnum("contest_status", [
// 	"Upcoming",
// 	"Active",
// 	"Finished",
// ]);
// export const contestVisibility = pgEnum("contest_visibility", [
// 	"public",
// 	"private",
// 	"archive",
// ]);

// // Tables
// export const users = pgTable("users", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	name: text("name").notNull(),
// 	email: text("email").notNull().unique(),
// 	password: text("password").notNull(),
// 	role: text("role").notNull().default("user"),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// 	updatedAt: timestamp("updated_at").defaultNow().notNull(),
// 	regNo: text("reg_no"),
// 	section: text("section"),
// 	passwordChanged: boolean("password_changed").default(true).notNull(),
// });

// export const problems = pgTable("problems", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	title: varchar("title", { length: 255 }).notNull(),
// 	description: text("description").notNull(),
// 	difficulty: difficulty("difficulty").default("medium"),
// 	hidden: boolean("hidden").default(false),
// 	sqlBoilerplate: text("sql_boilerplate").notNull(), // Default SQL boilerplate code
// 	sqlSolution: text("sql_solution").notNull(), // Solution in SQL
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// 	updatedAt: timestamp("updated_at"),
// });

// export const tags = pgTable("tags", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	name: varchar("name", { length: 50 }).notNull().unique(),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// export const problem_tags = pgTable(
// 	"problem_tags",
// 	{
// 		problemId: uuid("problem_id")
// 			.notNull()
// 			.references(() => problems.id, { onDelete: "cascade" }),
// 		tagId: uuid("tag_id")
// 			.notNull()
// 			.references(() => tags.id, { onDelete: "cascade" }),
// 	},
// 	(table) => [primaryKey({ columns: [table.problemId, table.tagId] })]
// );

// export const submissions = pgTable("submissions", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	userId: uuid("user_id")
// 		.notNull()
// 		.references(() => users.id, { onDelete: "cascade" }),
// 	problemId: uuid("problem_id")
// 		.notNull()
// 		.references(() => problems.id, { onDelete: "cascade" }),
// 	code: text("code").notNull(), // SQL code
// 	status: submissionResult("status").default("Pending"),
// 	memory: doublePrecision("memory"),
// 	time: doublePrecision("time"),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// export const problem_test_cases = pgTable("problem_test_cases", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	problemId: uuid("problem_id")
// 		.notNull()
// 		.references(() => problems.id, { onDelete: "cascade" }),
// 	inputData: text("input_data").notNull(), // SQL database state
// 	expectedOutput: text("expected_output").notNull(), // Expected SQL query result
// 	isHidden: boolean("is_hidden").default(false),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// 	updatedAt: timestamp("updated_at")
// 		.default(sql`now()`)
// 		.notNull(),
// });

// export const submission_test_results = pgTable("submission_test_results", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	submissionId: uuid("submission_id")
// 		.notNull()
// 		.references(() => submissions.id, { onDelete: "cascade" }),
// 	testCaseId: uuid("test_case_id")
// 		.notNull()
// 		.references(() => problem_test_cases.id, { onDelete: "cascade" }),
// 	actualOutput: text("actual_output").notNull(),
// 	result: testCaseResult("result").default("Pending"),
// 	memoryUsage: doublePrecision("memory_usage"),
// 	executionTime: doublePrecision("execution_time"),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// export const contests = pgTable("contests", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	title: varchar("title", { length: 255 }).notNull(),
// 	description: text("description").notNull(),
// 	startTime: timestamp("start_time").notNull(),
// 	endTime: timestamp("end_time").notNull(),
// 	leaderBoard: boolean("leader_board").default(false),
// 	createdBy: uuid("created_by")
// 		.notNull()
// 		.references(() => users.id),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// 	updatedAt: timestamp("updated_at")
// 		.default(sql`now()`)
// 		.notNull(),
// 	protectedContest: boolean("protected_contest").default(false),
// 	passwordHash: varchar("password_hash", { length: 255 }),
// 	fullScreenRequired: boolean("full_screen_required").default(true),
// });

// export const contestProblems = pgTable(
// 	"contest_problems",
// 	{
// 		contestId: uuid("contest_id")
// 			.notNull()
// 			.references(() => contests.id, { onDelete: "cascade" }),
// 		problemId: uuid("problem_id")
// 			.notNull()
// 			.references(() => problems.id, { onDelete: "cascade" }),
// 		points: integer("points").default(100).notNull(),
// 		solved: boolean("solved").default(false),
// 		createdAt: timestamp("created_at").defaultNow().notNull(),
// 		updatedAt: timestamp("updated_at")
// 			.default(sql`now()`)
// 			.notNull(),
// 	},
// 	(table) => {
// 		return [primaryKey({ columns: [table.contestId, table.problemId] })];
// 	}
// );

// export const contestSubmission = pgTable("contest_submissions", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	contestId: uuid("contest_id")
// 		.notNull()
// 		.references(() => contests.id, { onDelete: "cascade" }),
// 	userId: uuid("user_id")
// 		.notNull()
// 		.references(() => users.id, { onDelete: "cascade" }),
// 	problemId: uuid("problem_id")
// 		.notNull()
// 		.references(() => problems.id, { onDelete: "cascade" }),
// 	submissionId: uuid("submission_id")
// 		.notNull()
// 		.references(() => submissions.id, { onDelete: "cascade" }),
// 	points: integer("points").default(0).notNull(),
// 	submittedAt: timestamp("submitted_at")
// 		.default(sql`now()`)
// 		.notNull(),
// });

// export const contestPoints = pgTable(
// 	"contest_points",
// 	{
// 		contestId: uuid("contest_id")
// 			.notNull()
// 			.references(() => contests.id, { onDelete: "cascade" }),
// 		userId: uuid("user_id")
// 			.notNull()
// 			.references(() => users.id, { onDelete: "cascade" }),

// 		pointsEarned: integer("points_earned").default(0).notNull(),
// 		updatedAt: timestamp("updated_at")
// 			.default(sql`now()`)
// 			.notNull(),
// 	},
// 	(table) => [primaryKey({ columns: [table.contestId, table.userId] })]
// );

// // New table for tracking contest access and lockouts
// export const contestAccess = pgTable(
// 	"contest_access",
// 	{
// 		contestId: uuid("contest_id")
// 			.notNull()
// 			.references(() => contests.id, { onDelete: "cascade" }),
// 		userId: uuid("user_id")
// 			.notNull()
// 			.references(() => users.id, { onDelete: "cascade" }),
// 		isLockedOut: boolean("is_locked_out").default(false),
// 		lockedOutAt: timestamp("locked_out_at"),
// 		lockedOutReason: text("locked_out_reason"),
// 		reEntryGranted: boolean("re_entry_granted").default(false),
// 		reEntryGrantedAt: timestamp("re_entry_granted_at"),
// 		reEntryGrantedBy: uuid("re_entry_granted_by").references(() => users.id),
// 		createdAt: timestamp("created_at").defaultNow().notNull(),
// 		updatedAt: timestamp("updated_at")
// 			.default(sql`now()`)
// 			.notNull(),
// 	},
// 	(table) => [primaryKey({ columns: [table.contestId, table.userId] })]
// );

// // Types
// export type NewUser = InferInsertModel<typeof users>;
// export type NewProblem = InferInsertModel<typeof problems>;
// export type NewTag = InferInsertModel<typeof tags>;
// export type NewProblemTag = InferInsertModel<typeof problem_tags>;
// export type NewSubmission = InferInsertModel<typeof submissions>;
// export type NewProblemTestCase = InferInsertModel<typeof problem_test_cases>;
// export type NewSubmissionTestResult = InferInsertModel<
// 	typeof submission_test_results
// >;
// export type NewContest = InferInsertModel<typeof contests>;
// export type NewContestProblem = InferInsertModel<typeof contestProblems>;
// export type NewContestSubmission = InferInsertModel<typeof contestSubmission>;
// export type NewContestPoint = InferInsertModel<typeof contestPoints>;
// export type NewContestAccess = InferInsertModel<typeof contestAccess>;


import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  pgEnum,
  boolean,
  integer,
  primaryKey,
  doublePrecision,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import type { InferInsertModel } from "drizzle-orm"

// Enums
export const userRole = pgEnum("user_role", ["admin", "user"])
export const difficulty = pgEnum("difficulty", ["easy", "medium", "hard"])
export const submissionResult = pgEnum("submission_result", ["AC", "Rejected", "Pending"])
export const testCaseResult = pgEnum("test_case_result", ["AC", "Fail", "TLE", "CompilationError", "Pending"])
export const contestStatus = pgEnum("contest_status", ["Upcoming", "Active", "Finished"])
export const contestVisibility = pgEnum("contest_visibility", ["public", "private", "archive"])
export const subscriptionStatus = pgEnum("subscription_status", ["active", "canceled", "expired", "pending"])
export const paymentStatus = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"])
export const planInterval = pgEnum("plan_interval", ["month", "year"])

// Tables
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  regNo: text("reg_no"),
  section: text("section"),
  passwordChanged: boolean("password_changed").default(true).notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  premiumExpiresAt: timestamp("premium_expires_at"),
  stripeCustomerId: text("stripe_customer_id"),
})

export const problems = pgTable("problems", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  difficulty: difficulty("difficulty").default("medium"),
  hidden: boolean("hidden").default(false),
  sqlBoilerplate: text("sql_boilerplate").notNull(), // Default SQL boilerplate code
  sqlSolution: text("sql_solution").notNull(), // Solution in SQL
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
})

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const problem_tags = pgTable(
  "problem_tags",
  {
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.problemId, table.tagId] })],
)

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  code: text("code").notNull(), // SQL code
  status: submissionResult("status").default("Pending"),
  memory: doublePrecision("memory"),
  time: doublePrecision("time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const problem_test_cases = pgTable("problem_test_cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  inputData: text("input_data").notNull(), // SQL database state
  expectedOutput: text("expected_output").notNull(), // Expected SQL query result
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
})

export const submission_test_results = pgTable("submission_test_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  testCaseId: uuid("test_case_id")
    .notNull()
    .references(() => problem_test_cases.id, { onDelete: "cascade" }),
  actualOutput: text("actual_output").notNull(),
  result: testCaseResult("result").default("Pending"),
  memoryUsage: doublePrecision("memory_usage"),
  executionTime: doublePrecision("execution_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const contests = pgTable("contests", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  leaderBoard: boolean("leader_board").default(false),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
  protectedContest: boolean("protected_contest").default(false),
  passwordHash: varchar("password_hash", { length: 255 }),
  fullScreenRequired: boolean("full_screen_required").default(true),
})

export const contestProblems = pgTable(
  "contest_problems",
  {
    contestId: uuid("contest_id")
      .notNull()
      .references(() => contests.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    points: integer("points").default(100).notNull(),
    solved: boolean("solved").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
  },
  (table) => {
    return [primaryKey({ columns: [table.contestId, table.problemId] })]
  },
)

export const contestSubmission = pgTable("contest_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  contestId: uuid("contest_id")
    .notNull()
    .references(() => contests.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  points: integer("points").default(0).notNull(),
  submittedAt: timestamp("submitted_at").default(sql`now()`).notNull(),
})

export const contestPoints = pgTable(
  "contest_points",
  {
    contestId: uuid("contest_id")
      .notNull()
      .references(() => contests.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    pointsEarned: integer("points_earned").default(0).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
  },
  (table) => [primaryKey({ columns: [table.contestId, table.userId] })],
)

// New table for tracking contest access and lockouts
export const contestAccess = pgTable(
  "contest_access",
  {
    contestId: uuid("contest_id")
      .notNull()
      .references(() => contests.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isLockedOut: boolean("is_locked_out").default(false),
    lockedOutAt: timestamp("locked_out_at"),
    lockedOutReason: text("locked_out_reason"),
    reEntryGranted: boolean("re_entry_granted").default(false),
    reEntryGrantedAt: timestamp("re_entry_granted_at"),
    reEntryGrantedBy: uuid("re_entry_granted_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
  },
  (table) => [primaryKey({ columns: [table.contestId, table.userId] })],
)

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(), // Price in cents
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  interval: planInterval("interval").notNull(),
  intervalCount: integer("interval_count").default(1).notNull(), // e.g., 1 month, 3 months, 1 year
  stripePriceId: text("stripe_price_id"),
  isActive: boolean("is_active").default(true).notNull(),
  features: text("features"), // JSON string of features
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  planId: uuid("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: subscriptionStatus("status").default("pending").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: uuid("subscription_id").references(() => userSubscriptions.id, { onDelete: "set null" }),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: doublePrecision("amount").notNull(), // Amount in cents
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: paymentStatus("status").default("pending").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Types
export type NewUser = InferInsertModel<typeof users>
export type NewProblem = InferInsertModel<typeof problems>
export type NewTag = InferInsertModel<typeof tags>
export type NewProblemTag = InferInsertModel<typeof problem_tags>
export type NewSubmission = InferInsertModel<typeof submissions>
export type NewProblemTestCase = InferInsertModel<typeof problem_test_cases>
export type NewSubmissionTestResult = InferInsertModel<typeof submission_test_results>
export type NewContest = InferInsertModel<typeof contests>
export type NewContestProblem = InferInsertModel<typeof contestProblems>
export type NewContestSubmission = InferInsertModel<typeof contestSubmission>
export type NewContestPoint = InferInsertModel<typeof contestPoints>
export type NewContestAccess = InferInsertModel<typeof contestAccess>
export type NewSubscriptionPlan = InferInsertModel<typeof subscriptionPlans>
export type NewUserSubscription = InferInsertModel<typeof userSubscriptions>
export type NewPayment = InferInsertModel<typeof payments>
