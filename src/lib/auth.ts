import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { MongoClient } from "mongodb";

import { validatePassword } from "@/lib/password";

// Environment validation
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not set.");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set.");
}

const getAuthBaseUrl = () => {
  if (
    process.env.BETTER_AUTH_URL &&
    !process.env.BETTER_AUTH_URL.includes("localhost")
  ) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

const authBaseURL = getAuthBaseUrl();

// MongoDB connection
const globalForMongo = globalThis as typeof globalThis & {
  bookNookMongoClient?: MongoClient;
};

const client =
  globalForMongo.bookNookMongoClient ??
  new MongoClient(process.env.MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.bookNookMongoClient = client;
}

const db = client.db("book-nook");

// Google OAuth configuration
const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const auth = betterAuth({
  appName: "BookNook",

  baseURL: authBaseURL,

  trustedOrigins: [
    "http://localhost:3000",
    "https://book-nook-frontend-iota.vercel.app",
    "https://book-nook-client-sigma.vercel.app",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],

  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,

    sendResetPassword: async ({ user, url }) => {
      console.info(`[BookNook] Password reset for ${user.email}: ${url}`);
    },
  },

  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : {},

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const body = ctx.body as
        | { email?: unknown; password?: unknown }
        | undefined;

      const password = typeof body?.password === "string" ? body.password : "";

      const passwordError = validatePassword(password);

      if (passwordError) {
        throw new APIError("BAD_REQUEST", {
          message: passwordError,
        });
      }

      const email =
        typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

      if (email) {
        const existingUser = await ctx.context.adapter.findOne({
          model: "user",
          where: [{ field: "email", value: email }],
        });

        if (existingUser) {
          throw new APIError("UNPROCESSABLE_ENTITY", {
            message:
              "An account with this email already exists. Try logging in instead.",
          });
        }
      }
    }),
  },

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        }),
      },
    }),
    nextCookies(),
  ],
});

export const isGoogleAuthEnabled = googleEnabled;
