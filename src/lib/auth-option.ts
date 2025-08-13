import {
  NextAuthOptions,
  TokenSet,
  User,
} from "next-auth";
import LinkedInProvider, { LinkedInProfile } from "next-auth/providers/linkedin";
import { TLoginRes, TProfileLinkedinRes } from "@/types/user";
import { endpoints } from "@/constants/endpoints";
import axios from "axios";

// const oauthProviders = ["linkedin", "google"];


export const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  providers: [
    // EmailProvider({
    //     server: process.env.EMAIL_SERVER || "",
    //     from: process.env.EMAIL_FROM || "",
    // }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      client: { token_endpoint_auth_method: "client_secret_post" },
      issuer: "https://www.linkedin.com",
      profile: async (profile: LinkedInProfile, tokens: TokenSet) => {
        const profileData = await axios.get<TProfileLinkedinRes>(
          "https://api.linkedin.com/v2/me",
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          }
        )
        const userInfoResponse = await axios.get(
          "https://api.linkedin.com/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          }
        );
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          linkedinUrl: `https://www.linkedin.com/in/${profileData.data.vanityName}`,
          linkedinEmail: userInfoResponse?.data?.email,
          linkedinHeadline: profileData?.data?.localizedHeadline,
          linkedinAvatar: profile.picture || userInfoResponse?.data?.pictureUrl,
        }
      },
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email r_basicprofile",
        },
      },
    }),
    // GoogleProvider({
    //     clientId: process.env.GOOGLE_CLIENT_ID || "",
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),
  ],
  pages: {
    signIn: "/api/auth/signin",
    signOut: "/api/auth/signout",
    error: "/api/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/api/auth/verify-request", // (used for check email message)
    newUser: "/api/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        const newUserRes = await updateUserSessionByEmail(user?.email ?? "");
        if (newUserRes?.userInfo) {
          token.accessToken = newUserRes.accessToken
        }
        token.provider = account.provider
      }
      return token
    },
    async signIn({ user, account }) {
      if (account === undefined)
        return false
      if (account?.provider === "linkedin") {
        return signInWithOAuth(user);
      }
      return true;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token?.accessToken,
      };
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Update user session
const updateUserSessionByEmail = async (email: string) => {
  const response = await axios.post<TLoginRes>(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1${endpoints.auth.loginWithEmail}`, { email }
  );
  if (response?.data)
    return response?.data
  return null;
};

// Sign In with OAuth
const signInWithOAuth = async (user: User) => {
  try {
    await axios.post<TLoginRes>(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1${endpoints.auth.loginWithEmail}`, user
    );
    return true;
  } catch {
    return false;
  }
};
