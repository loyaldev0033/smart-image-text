import { axiosGet, profileQueryKeys } from "@/api";
import { endpoints } from "@/constants/endpoints";
import { useQuery } from "@tanstack/react-query";

export type TDiscourseForumTopic = {
  id: number;
  title: string;
  slug: string;
  postCount: number;
  views: number;
  likeCount: number;
  createdAt: string;
  lastPostAt: string;
};

type TLatestTopics = {
  latestTopics: TDiscourseForumTopic[];
};

export function useLatestTopics() {
  const getAllProfileFn = async () => {
    return await axiosGet<TLatestTopics>(endpoints.profile.getLatestTopics);
  };

  return useQuery({
    queryKey: profileQueryKeys.latestTopics(),
    queryFn: getAllProfileFn,
    retry: 1,
  });
}
