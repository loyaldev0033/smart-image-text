import { EVoteType } from "@/types/base";

export enum EUserEvent {
  FlagAmountChanged = "user.FlagAmountChanged",
  UserRedFlagged = "user.UserRedFlagged",
  UserGreenFlagged = "user.UserGreenFlagged",
  UserCommentStory = "user.UserCommentStory",
  UserVotesMeme = "user.UserVotesMeme",
  UserVotesCategory = "user.UserVotesCategory",
  UserFollowProfile = "user.UserFollowProfile",
  UserReceiveGreenFlag = "user.UserReceiveGreenFlag",
  UserNewUpdates = "user.UserNewUpdates",
  UserNewAnnouncements = "user.UserNewAnnouncements",
}

export type TUserFlaggedNotificationPayload = {
  fromUserId: string;
  toProfileId: string;
  txId?: string;
};

export type TUserCommentStoryNotificationPayload = {
  fromUserId: string;
  storyId: string;
  txId?: string;
};

export type TUserVoteMemeNotificationPayload = {
  fromUserId: string;
  memeId: string;
  voteType: EVoteType;
  txId?: string;
};

export type TUserVoteCategoryNotificationPayload = {
  fromUserId: string;
  categoryId: string;
  voteType: EVoteType;
  txId?: string;
};

export type TUserFollowProfileNotificationPayload = {
  fromUserId: string;
  toProfileId: string;
  txId?: string;
};

export type TUserReceiveGreenFlagNotificationPayload = {
  toUserId: string;
  amount: number;
  txId?: string;
};

export type TSystemNotificationPayload = {
  title: string;
  content: string;
  txId?: string;
};
