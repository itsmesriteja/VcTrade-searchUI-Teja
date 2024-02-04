/**
 * Configuration options for fetching user data.
 * The number of results to fetch. Optional.
 * The page number to fetch. Required.
 */

interface FetchUsersConfig {
  results?: number,
  page: number
}

/**
 * Generates a URL for fetching user data based on the provided configuration.
 * @param config - The configuration options for fetching users.
 * @returns A URL string for fetching user data.
 */

export const getFetchUsersURL = (config: FetchUsersConfig): string => {
  return `https://randomuser.me/api/?results=${config.results ?? 25}&page=${config.page ?? 0}&inc=gender,name,email,location,login,picture,id,dob`
}