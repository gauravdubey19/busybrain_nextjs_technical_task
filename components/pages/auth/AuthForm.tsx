"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { logIn } from "@/utils/actions/auth";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";

interface AuthFormType {
  type?: "sign-in" | "sign-up";
}

const authFormSchema = (type: AuthFormType) => {
  return z.object({
    name:
      type.type === "sign-up"
        ? z.string().min(3).max(100)
        : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  });
};

const AuthForm: React.FC<AuthFormType> = ({ type = "sign-in" }) => {
  const { status } = useSession();
  const router = useRouter();
  const isSingIn = type === "sign-in";
  const formSchema = authFormSchema({ type });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { name, email, password } = values;
      if (isSingIn) {
        try {
          // const userCredential = await signInWithEmailAndPassword(
          //   auth,
          //   email,
          //   password
          // );

          // const idToken = await userCredential.user.getIdToken();

          // if (!idToken) {
          //   toast.error("Sign in failed!");
          //   return;
          // }

          // await signIn({ email, idToken });

          toast.success("Sign In Successful!");
          router.push("/dashboard");
        } catch (error: unknown) {
          if (typeof error === "object" && error && "code" in error) {
            if (error.code === "auth/invalid-credential") {
              toast.error("Invalid email or password");
            } else {
              toast.error("Failed to sign in, please try again");
            }
          }
          console.error(error);
        }
      } else {
        // const userCredential = await createUserWithEmailAndPassword(
        //   auth,
        //   email,
        //   password
        // );

        // const result = await signUp({
        //   uid: userCredential.user.uid,
        //   email,
        //   password,
        //   name: name!,
        // });

        // if (!result?.success) {
        //   toast.error(result?.message || "Sign up failed");
        //   return;
        // }
        toast.success("Account Created Successfully! Please Sign In");
        // toast.success("Sign Up Successful!");
        router.push("/sign-in");
      }
      console.log(values);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again..");
    }
  }

  if (status === "loading") return <Loader />;
  if (status === "authenticated") {
    router.replace("/items");
  }
  return (
    <>
      <section className="w-full h-full flex-center py-20">
        <Card className="w-full h-fit max-w-sm md:max-w-md animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-primary-100 font-bold text-3xl">
              BusyBrain Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 mt-4 form"
              >
                {!isSingIn && (
                  <FormField
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                  />
                )}
                <FormField
                  control={form.control}
                  type="email"
                  name="email"
                  label="E-mail"
                  placeholder="Enter your email"
                />
                <FormField
                  control={form.control}
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Create your password"
                />

                <Button type="submit" effect="gooeyRight" className="w-full">
                  {isSingIn ? "Sign In" : "Create an Account"}
                </Button>
              </form>
            </Form>

            <div className="flex items-center justify-center gap-3 py-5">
              <span className="w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent dark:via-gray-600"></span>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium px-2">
                OR
              </span>
              <span className="w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent dark:via-gray-600"></span>
            </div>

            <Button
              type="button"
              onClick={() => logIn("google")}
              effect="gooeyRight"
              className="w-full"
            >
              Sign {isSingIn ? "In" : "Up"} with Google
            </Button>
            {/* <GoogleAuthButton mode="signin" /> */}

            <p className="text-center text-gray-600 dark:text-gray-300 mt-5">
              {isSingIn ? "New User?" : "Already have an account?"}
              <Link
                href={isSingIn ? "/sign-up" : "/sign-in"}
                className="font-semibold text-primary-100 ml-1 hover:underline transition-colors duration-200"
              >
                {isSingIn ? "Sign Up Now!" : "Sign In!"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AuthForm;
