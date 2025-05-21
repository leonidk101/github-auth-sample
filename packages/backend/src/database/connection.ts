import pg from 'pg'
import { config } from '../config/environment.js'

const { Pool } = pg

// Create a new pool instance with the connection string
const pool = new Pool({
	connectionString: config.databaseUrl,
})

/**
 * Connect to the database and verify connection
 */
export async function connectToDatabase() {
	try {
		const client = await pool.connect()
		console.log('✅ Connected to PostgreSQL database')
		client.release()
		return pool
	} catch (error) {
		console.error('❌ Failed to connect to PostgreSQL database:', error)
		throw error
	}
}

/**
 * Get a client from the pool
 */
export async function getClient() {
	return await pool.connect()
}

/**
 * Execute a query using the pool
 */
export async function query(text: string, params: any[] = []) {
	const start = Date.now()
	const res = await pool.query(text, params)
	const duration = Date.now() - start

	if (config.isDevelopment) {
		console.log('Executed query', { text, duration, rows: res.rowCount })
	}

	return res
}
