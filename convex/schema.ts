import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  // Your other tables...
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string(),
  }),
});
 
export default schema;