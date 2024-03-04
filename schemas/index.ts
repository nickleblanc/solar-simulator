import { z } from "zod";

export const formSchema = z.object({
  latitude: z.string().min(2, {
    message: "Latitude must be at least 1 character.",
  }),
  longitude: z.string().min(2, {
    message: "Longitude must be at least 1 character.",
  }),
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
});
