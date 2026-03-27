import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string(),
    role: v.optional(v.union(v.literal("admin"), v.literal("student"))),
  }).index("by_email", ["email"]),

  quizHistory: defineTable({
    userId: v.id("users"),
    subject: v.string(),
    topic: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    accuracy: v.number(),
    timeTaken: v.number(), // seconds
    answeredAt: v.number(), // timestamp ms
  })
    .index("by_user", ["userId"])
    .index("by_user_subject", ["userId", "subject"]),
});

export default schema;