/**
 * Interface representing a GitHub profile as returned by the GitHub OAuth API
 */
export interface GitHubProfile {
  id: string;
  username?: string;
  displayName?: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
} 