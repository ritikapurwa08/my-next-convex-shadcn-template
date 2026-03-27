import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});

export const updateRole = mutation({
  args: { userId: v.id("users"), role: v.union(v.literal("admin"), v.literal("student")) },
  handler: async (ctx, { userId, role }) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("Not authenticated");
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") throw new Error("Forbidden");
    await ctx.db.patch(userId, { role });
  },
});