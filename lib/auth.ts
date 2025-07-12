import { prisma } from "@/db/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
}),
  /*advanced: {
    database: {
      generateId: false,
    },
  },*/
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({user, url}) => {
      await sendEmail(user.email, "Reset your password",`Click the link to reset your password: ${url}`);
    },
  },
  
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_ID as string, 
      clientSecret: process.env.GOOGLE_SECRET as string, 
    }, 
    github: {
      prompt: "select_account",
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    },
  },
});
