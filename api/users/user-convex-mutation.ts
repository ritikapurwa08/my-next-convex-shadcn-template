import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function useGetCurrentUser() {
  const user = useQuery(api.users.current);
  return user;
}