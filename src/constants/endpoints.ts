export const endpoints = {
  auth: {
    base: "/auth",
    loginWithReferral: "/auth/sign-referral",
    loginWithEmail: "/auth/sign-in/email",
  },
  profile: {
    base: "/profile",
    detail: "/profile/detail",
    detailMe: "/profile/me-detail",
    me: "/profile/me",

    baseList: "/profile/list",
    searchProfile: "/profile/presearch",

    searchByLink: "/profile/search-link",

    dashboardStatistics: "/profile/dashboard-statistics",
    getLatestTopics: "/profile/latest-topics",

    reviewProfile: "/profile/review",

    donate: "/profile/donate",

    followProfile: (id: string) => `/profile/follow/${id}`,
    followList: "/profile/follow-list",
  },
  stripePayment: {
    base: "/stripe-payment",
    rflagSession: "/stripe-payment/rflag-session",
    paymentTx: "/stripe-payment/payment-tx",
  },
  user: {
    base: "/user",
    updateUserSelf: "/user/me",
  },
  post: {
    base: "/post",
    playPost: (id: string) => `/post/${id}/play`,
    votePost: (id: string) => `/post/${id}/vote`,
  },
  vote: {
    base: "/votes",
  },
};
