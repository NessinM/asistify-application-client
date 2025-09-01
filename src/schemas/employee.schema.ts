import { z } from 'zod';

export const getSchema = z.object({
  page: z.string().min(1),
  page_size: z.string().min(1),
  search: z.string().default(''),
  sort: z
    .array(
      z.object({
        id: z.string().min(1),
        desc: z.boolean().default(false),
      })
    )
    .min(1),
});
