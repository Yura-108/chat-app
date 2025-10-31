import NextAuth, {AuthOptions} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {signInSchema} from "@/schema/zod";
import {getUserFromDb} from "@/utils/user";
import bcryptjs from "bcryptjs";
import { ZodError } from "zod"

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "text"}
      },
      authorize: async (credentials) => {
       try {
         if (!credentials?.email || !credentials?.password) return null;

         const { email, password } = await signInSchema.parseAsync(credentials);

         const user = await getUserFromDb(email);

         if (!user || !user.password) {
           return null;
         }

         const isPasswordValid = await bcryptjs.compare(
           password,
           user.password
         );

         if (!isPasswordValid) return null;

         return {id: user.id, email: user.email};
       } catch (error) {
         if (error instanceof ZodError) {
           throw new Error("Неверный формат email или пароль");
         }
         throw error;
       }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({session, token}) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
  }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};