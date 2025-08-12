// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const profileQueryKeys = {
  all: ["profiles"],
  details: () => [...profileQueryKeys.all, "detail"],
  list: () => [...profileQueryKeys.all, "list"],
  followList: (filter: string) => [
    ...profileQueryKeys.all,
    "followList",
    filter,
  ],
  me: () => [...profileQueryKeys.detail("me"), "me"],
  detail: (id: string) => [...profileQueryKeys.details(), id],
  searchKey: (link: string) => [...profileQueryKeys.details(), link],
  searchProfileKey: (keywords: string) => [
    ...profileQueryKeys.details(),
    keywords,
  ],
  pagination: (page: number) => [...profileQueryKeys.all, "pagination", page],
  infinite: () => [...profileQueryKeys.all, "infinite"],
  dashboardStatistics: () => [...profileQueryKeys.all, "dashboardStatistics"],
  latestTopics: () => [...profileQueryKeys.all, "latestTopics"],
};
