import { z } from "zod";

export const createConversationSchema = z.object({
  body: z.object({
    applicationId: z.string().min(1, "Application id is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});