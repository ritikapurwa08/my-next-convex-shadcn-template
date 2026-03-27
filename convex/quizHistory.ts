import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    subject: v.string(),
    topic: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    accuracy: v.number(),
    timeTaken: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.insert("quizHistory", {
      userId,
      ...args,
      answeredAt: Date.now(),
    });
  },
});

export const listByUser = query({
  args: {
    subject: v.optional(v.string()),
    timeFilter: v.optional(v.union(v.literal("today"), v.literal("week"), v.literal("month"))),
  },
  handler: async (ctx, { subject, timeFilter }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let records = subject
      ? await ctx.db.query("quizHistory").withIndex("by_user_subject", (q) => q.eq("userId", userId).eq("subject", subject)).order("desc").collect()
      : await ctx.db.query("quizHistory").withIndex("by_user", (q) => q.eq("userId", userId)).order("desc").collect();

    if (timeFilter) {
      const now = Date.now();
      const cutoffs = { today: 86400000, week: 604800000, month: 2592000000 };
      records = records.filter((r) => now - r.answeredAt < cutoffs[timeFilter]);
    }

    return records.slice(0, 10);
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const records = await ctx.db.query("quizHistory").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    if (records.length === 0) return { totalQuizzes: 0, avgAccuracy: 0, bestSubject: "—" };

    const avgAccuracy = Math.round(records.reduce((s, r) => s + r.accuracy, 0) / records.length);

    const subjectMap: Record<string, number[]> = {};
    records.forEach((r) => {
      if (!subjectMap[r.subject]) subjectMap[r.subject] = [];
      subjectMap[r.subject].push(r.accuracy);
    });
    const bestSubject = Object.entries(subjectMap).sort((a, b) => {
      const avgA = a[1].reduce((s, v) => s + v, 0) / a[1].length;
      const avgB = b[1].reduce((s, v) => s + v, 0) / b[1].length;
      return avgB - avgA;
    })[0]?.[0] ?? "—";

    return { totalQuizzes: records.length, avgAccuracy, bestSubject };
  },
});