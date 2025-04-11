"use server";

import { signIn, signOut } from "@/utils/auth";
import { BuiltInProviderType } from "next-auth/providers";
import { revalidatePath } from "next/cache";

export async function logIn(provider: BuiltInProviderType) {
  await signIn(provider, { redirectTo: "/" });
  revalidatePath("/");
}

export async function logOut() {
  await signOut({ redirect: true, redirectTo: "/" });
}
