import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { config } from '../config/environment.js'
import { findUserById, findOrCreateUserFromGithub, GithubUser } from '../models/user.js'
import { GitHubProfile } from './types.js'

export function setupAuth() {
	// Serialize user to session
	passport.serializeUser((user: any, done: (err: Error | null, id?: string) => void) => {
		done(null, user.id)
	})

	// Deserialize user from session
	passport.deserializeUser(async (id: string, done: (err: Error | null, user?: any) => void) => {
		try {
			const user = await findUserById(id)
			done(null, user)
		} catch (error) {
			done(error as Error | null)
		}
	})

	// Set up GitHub OAuth strategy
	passport.use(
		new GitHubStrategy(
			{
				clientID: config.github.clientId,
				clientSecret: config.github.clientSecret,
				callbackURL: config.github.callbackUrl,
			},
			async (
				accessToken: string,
				refreshToken: string,
				profile: GitHubProfile,
				done: (err: Error | null, user?: any) => void
			) => {
				try {
					// Find or create user in our database
					const user = await findOrCreateUserFromGithub({
						githubId: profile.id,
						username: profile.username || '',
						displayName: profile.displayName || profile.username || '',
						email: profile.emails?.[0]?.value,
						avatarUrl: profile.photos?.[0]?.value,
					})

					return done(null, user)
				} catch (error) {
					return done(error as Error)
				}
			}
		)
	)
}
