import { query } from './connection.js';
import { initUserTable } from '../models/user.js';

/**
 * Initialize the database schema
 * This creates all necessary tables if they don't exist
 */
export async function initializeDatabase() {
  console.log('Initializing database schema...');
  
  try {
    // Create extension for UUID generation if it doesn't exist
    await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    
    // Initialize tables
    await initUserTable();
    
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database schema:', error);
    throw error;
  }
} 