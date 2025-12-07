import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Important for production
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          // Safety: Fallback to localhost if env var is missing during dev
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          
          console.log(`Connecting to backend at: ${apiUrl}/api/auth/google`);

          const response = await fetch(`${apiUrl}/api/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              avatar: user.image,
              googleId: user.id, // This maps to 'googleId' in your backend
            }),
          });

          if (response.ok) {
            const data = await response.json();
            
            // Attach backend token to the user object so it passes to the JWT callback
            user.accessToken = data.token;
            user.userData = data.user;
            return true;
          } else {
            console.error("Backend rejected Google login:", await response.text());
            return false;
          }
        } catch (error) {
          console.error("Google sign-in network error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = (user as any).accessToken;
        token.userData = (user as any).userData;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).user = token.userData;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export { handler as GET, handler as POST };