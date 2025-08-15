export interface projectsType {
  id: number;
  opensource: false | string;
  title: string;
  description: string;
  url: string;
  imageURL: string;
}

/**
 * Used for types for the response of `/api/githubstats?repo={owner/repo}`
 */
export interface githubStatsType {
  stars: number;
}
