import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "admin";
  }

  interface Session {
    user: {
      id: string;
      role: "admin";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin";
  }
}
