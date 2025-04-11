"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { logIn } from "@/utils/actions/auth";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  // console.log("status: ", status, "\nserver session: ", session);

  return (
    <>
      <div className="mt-20">
        <Button
          onClick={() => {
            if (!session?.user) {
              logIn("google");
            } else {
              signOut({ callbackUrl: "/" });
              router.refresh();
            }
          }}
          disabled={status === "loading"}
          title={
            status === "loading"
              ? "Loading"
              : session?.user
              ? "Sign out"
              : "Sign in google"
          }
        >
          {status === "loading"
            ? "Loading"
            : session?.user
            ? "Sign out"
            : "Sign in google"}
        </Button>

        <div className="mt-5">
          <pre className="capitalize">status: {status}</pre>
          <pre>Session: {JSON.stringify(session, null, 2)}</pre>
        </div>
      </div>
    </>
  );
};

export default Login;
