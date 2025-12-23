export interface projectsType {
  id: number;
  opensource: false | string;
  title: string;
  description: string;
  url: string;
  imageURL: string | {
    light: string;
    dark: string;
  };
  /**
   * If not true, Provide a reason why the project is not embeddable
   */
  allowEmbedded: true | string;
}

/**
 * Used for types for the response of `/api/githubstats?repo={owner/repo}`
 */
export interface githubStatsType {
  stars: number;
}
