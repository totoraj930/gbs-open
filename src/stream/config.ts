import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

export const zStreamConfig = z.object({
  STREAM_PORT: z.string(),
});

export const streamEnv = zStreamConfig.parse(process.env);
