"use server";

import { revalidatePath } from "next/cache";
import { BuiltInProviderType } from "next-auth/providers";
import { signIn, signOut } from "@/utils/auth";

export async function logIn(
  provider: BuiltInProviderType,
  credentials?: Record<string, unknown>
) {
  const result = await signIn(provider, {
    ...(credentials ? credentials : {}),
    redirectTo: "/",
    redirect: credentials ? false : true,
  });
  revalidatePath("/");
  return result;
}

export async function logOut() {
  await signOut({ redirect: true, redirectTo: "/" });
}
