"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { logIn } from "@/utils/actions/auth";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/ui/form-field";
import Loader from "@/components/ui/loader";

interface AuthFormType {
  type?: "sign-in" | "sign-up";
}

const authFormSchema = (type: AuthFormType, isOtpSent: boolean) => {
  const baseSchema = {
    name:
      type.type === "sign-up"
        ? z.string().min(3, "Name must be at least 3 characters").max(100)
        : z.string().optional(),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    otp:
      type.type === "sign-up" && isOtpSent
        ? z.string().min(6, "Please enter the OTP from your email")
        : z.string().optional(),
  };

  return z.object(baseSchema);
};

const AuthForm: React.FC<AuthFormType> = ({ type = "sign-in" }) => {
  const { status } = useSession();
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [checkOtpCode, setCheckOtpCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignIn = type === "sign-in";

  const formSchema = authFormSchema({ type }, isOtpSent);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      otp: "",
    },
    mode: "onChange",
  });

  const { formState, handleSubmit, reset, setValue } = form;
  const { isValid } = formState;

  // re-register the otp field when isOtpSent changes
  useEffect(() => {
    if (isOtpSent) {
      setValue("otp", "");
    }
  }, [isOtpSent, setValue]);

  useEffect(() => {
    // triggers to re-validation
    form.trigger();
  }, [isOtpSent, form]);

  const onSubmit = async (values: FormValues) => {
    console.log("Form values:", values);
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { name, email, password } = values;
      const otp = "otp" in values ? values.otp : "";

      if (isSignIn) {
        try {
          const user = await logIn("credentials", { email, password });

          if (!user) {
            toast.error("Invalid email or password");
            return;
          }

          toast.success("Sign In Successful!");
          router.push("/items");
        } catch (error) {
          console.error("Login error:", error);
          toast.error("Failed to sign in. Please check your credentials.");
        }
      } else {
        // sign up flow
        if (!isOtpSent) {
          // 1st requesting to generate OTP
          try {
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name,
                email,
                password,
                otp: "",
                checkOtpCode: null,
              }),
            });

            if (!res.ok) {
              const errorData = await res.text();
              throw new Error(errorData || "Failed to send OTP");
            }

            const data = await res.json();
            console.log("OTP response data:", data);

            setCheckOtpCode(data.data);
            setIsOtpSent(true);
            toast.success(data.message || "OTP sent to your email");
          } catch (error) {
            console.error("OTP request error:", error);
            toast.error(
              error instanceof Error ? error.message : "Failed to send OTP"
            );
          }
        } else {
          // sending the OTP to complete the registration
          try {
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name,
                email,
                password,
                otp,
                checkOtpCode,
              }),
            });

            if (!res.ok) {
              const errorData = await res.text();
              throw new Error(errorData || "Registration failed");
            }

            toast.success("Account Created Successfully! Please Sign In");
            reset();
            router.push("/sign-in");
          } catch (error) {
            console.error("Registration error:", error);
            toast.error(
              error instanceof Error ? error.message : "Registration failed"
            );
          }
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await logIn("google");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
    }
  };

  // redirecting user if already authenticated
  if (status === "loading") return <Loader />;
  if (status === "authenticated") router.replace("/items");

  const buttonText = isSignIn
    ? "Sign In"
    : isOtpSent
    ? "Verify & Create Account"
    : "Send Verification Code";

  return (
    <>
      <section
        className={`w-full h-full flex-center ${isSignIn ? "py-20" : "py-10"}`}
      >
        <Card className="w-full h-fit max-w-sm md:max-w-md animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-primary-100 font-bold text-3xl">
              BusyBrain Task
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {isSignIn
                ? "Sign in to your account"
                : isOtpSent
                ? "Enter the verification code sent to your email"
                : "Create a new account"}
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-6 mt-4 form"
              >
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                    disabled={isOtpSent}
                  />
                )}

                <FormField
                  control={form.control}
                  type="email"
                  name="email"
                  label="E-mail"
                  placeholder="Enter your email"
                  disabled={isOtpSent}
                />

                <FormField
                  control={form.control}
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Create your password"
                  disabled={isOtpSent}
                />

                {!isSignIn && isOtpSent && (
                  <FormField
                    control={form.control}
                    name="otp"
                    label="Verification Code"
                    placeholder="Enter the 6-digit code"
                    disabled={isSubmitting}
                  />
                )}

                <Button
                  type="submit"
                  effect="gooeyRight"
                  className="w-full"
                  disabled={isSubmitting || (!isValid && isOtpSent)}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    buttonText
                  )}
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
              onClick={handleSignInWithGoogle}
              effect="gooeyRight"
              className="w-full"
              disabled={isSubmitting}
            >
              Sign {isSignIn ? "In" : "Up"} with Google
            </Button>

            <p className="text-center text-gray-600 dark:text-gray-300 mt-5">
              {isSignIn ? "New User?" : "Already have an account?"}
              <Link
                href={isSignIn ? "/sign-up" : "/sign-in"}
                className="font-semibold text-primary-100 ml-1 hover:underline transition-colors duration-200"
              >
                {isSignIn ? "Sign Up Now!" : "Sign In!"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AuthForm;
