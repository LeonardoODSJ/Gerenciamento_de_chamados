import { createHash } from "crypto";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { options } from "./auth-api";

export const userSession = async (): Promise<UserModel | null> => {
  const session = await getServerSession(options);
  if (session && session.user) {
    return {
      name: session.user.name!,
      image: session.user.image!,
      email: session.user.email!,
    };
  }

  return null;
};

export const getCurrentUser = async (): Promise<UserModel> => {
  const user = await userSession();
  if (user) {
    return user;
  }
  throw new Error("User not found");
};

export const userHashedId = async (): Promise<string> => {
  const user = await userSession();
  if (user) {
    return hashValue(user.email);
  }

  throw new Error("User not found");
};

export const hashValue = (value: string): string => {
  const hash = createHash("sha256");
  hash.update(value);
  return hash.digest("hex");
};

type Page = "Home" | "search";

export const RedirectToPage = (path: Page) => {
  redirect(`/${path}`);
};

export const redirectIfAuthenticated = async () => {
  const user = await userSession();
  if (user) {
    RedirectToPage("Home");
  }
};

export type UserModel = {
  name: string;
  image: string;
  email: string;
};
