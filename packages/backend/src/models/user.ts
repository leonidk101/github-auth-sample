import { query } from '../database/connection.js';

// User interface definition
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  githubId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creating a new user from GitHub OAuth
export interface GithubUser {
  githubId: string;
  username: string;
  displayName: string;
  email?: string | null;
  avatarUrl?: string | null;
}

/**
 * Initialize user table if it doesn't exist
 */
export async function initUserTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(255) NOT NULL UNIQUE,
      display_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      avatar_url TEXT,
      github_id VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  
  if (result.rowCount === 0) {
    return null;
  }
  
  return mapDbUserToUser(result.rows[0]);
}

/**
 * Find a user by GitHub ID
 */
export async function findUserByGithubId(githubId: string): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE github_id = $1', [githubId]);
  
  if (result.rowCount === 0) {
    return null;
  }
  
  return mapDbUserToUser(result.rows[0]);
}

/**
 * Create a new user from GitHub OAuth data
 */
export async function createUserFromGithub(data: GithubUser): Promise<User> {
  const result = await query(
    `INSERT INTO users (username, display_name, email, avatar_url, github_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.username, data.displayName, data.email || null, data.avatarUrl || null, data.githubId]
  );
  
  return mapDbUserToUser(result.rows[0]);
}

/**
 * Find an existing user by GitHub ID or create a new one
 */
export async function findOrCreateUserFromGithub(data: GithubUser): Promise<User> {
  // Try to find existing user
  const existingUser = await findUserByGithubId(data.githubId);
  
  if (existingUser) {
    // Update user information if needed
    const needsUpdate = 
      existingUser.username !== data.username ||
      existingUser.displayName !== data.displayName ||
      existingUser.email !== data.email ||
      existingUser.avatarUrl !== data.avatarUrl;
    
    if (needsUpdate) {
      const result = await query(
        `UPDATE users
         SET username = $1, display_name = $2, email = $3, avatar_url = $4, updated_at = NOW()
         WHERE github_id = $5
         RETURNING *`,
        [data.username, data.displayName, data.email || null, data.avatarUrl || null, data.githubId]
      );
      
      return mapDbUserToUser(result.rows[0]);
    }
    
    return existingUser;
  }
  
  // Create new user
  return await createUserFromGithub(data);
}

/**
 * Map database row to User interface
 */
function mapDbUserToUser(dbUser: any): User {
  return {
    id: dbUser.id,
    username: dbUser.username,
    displayName: dbUser.display_name,
    email: dbUser.email,
    avatarUrl: dbUser.avatar_url,
    githubId: dbUser.github_id,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
  };
} 