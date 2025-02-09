import { z } from 'zod';

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
    NEXT_PUBLIC_URL: z.string(),
});

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
});

if (!configProject.success) {
    // eslint-disable-next-line no-console
    console.error(configProject.error.issues);
    throw new Error('Variables in .env are not valid!');
}

const envConfig = configProject.data;

export default envConfig;
