import { axiosPost } from "@/api";
import { endpoints } from "@/constants/endpoints";
import { toast } from "@/hooks/use-toast";
import { useTransitionRouter } from "@/lib/view-transition/use-transition-router";
import { useMutation } from "@tanstack/react-query";

export function useGetProfileByLink() {
  const router = useTransitionRouter();

  const searchProfileFn = async ({
    link,
  }: {
    link: string;
    flagCategories?: string[];
  }) => {
    return await axiosPost(`${endpoints.profile.searchByLink}`, {
      data: { link },
    });
  };

  return useMutation({
    mutationFn: searchProfileFn,
    onSuccess: (resData, variables) => {
      if (resData?._id) {
        if ((variables.flagCategories?.length ?? 0) > 0) {
          router.push(
            `/profile/${resData?._id}?flagCategories=${variables.flagCategories?.join(",")}&flag=true`,
          );
        } else {
          router.push(`/profile/${resData?._id}`);
        }
      } else
        toast({
          title: "Profile not found",
          description: "We couldn't find a profile matching the provided link.",
          variant: "destructive",
          className: "max-w-[320px] p-3",
        });
    },
    retry: 1,
  });
}
