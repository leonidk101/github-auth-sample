import { z } from 'zod'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Define environment variable schema
const environmentSchema = z.object({
	// Server
	PORT: z.string().default('4000'),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	FRONTEND_ORIGIN: z.string().default('http://localhost:3000'),

	// Database
	DATABASE_URL: z.string(),

	// Auth
	SESSION_SECRET: z.string().min(1),
	GITHUB_CLIENT_ID: z.string().min(1),
	GITHUB_CLIENT_SECRET: z.string().min(1),
	GITHUB_CALLBACK_URL: z.string().url(),
})

// Parse and validate environment variables
const env = environmentSchema.safeParse(process.env)

if (!env.success) {
	console.error('❌ Invalid environment variables:', env.error.format())
	throw new Error('Invalid environment variables')
}

// Export typed config
export const config = {
	port: parseInt(env.data.PORT, 10),
	isProduction: env.data.NODE_ENV === 'production',
	isDevelopment: env.data.NODE_ENV === 'development',
	isTest: env.data.NODE_ENV === 'test',
	frontendOrigin: env.data.FRONTEND_ORIGIN,
	databaseUrl: env.data.DATABASE_URL,
	sessionSecret: env.data.SESSION_SECRET,
	github: {
		clientId: env.data.GITHUB_CLIENT_ID,
		clientSecret: env.data.GITHUB_CLIENT_SECRET,
		callbackUrl: env.data.GITHUB_CALLBACK_URL,
	},
}
