import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

export const zSiteConfig = z.object({
  PORT: z.string(),
});

export const siteEnv = zSiteConfig.parse(process.env);
