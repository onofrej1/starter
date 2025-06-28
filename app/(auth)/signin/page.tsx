"use client";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { FormField } from "@/types/resources";
import { LoginUser } from "@/validation";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  //const { data: session, status } = useSession();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  type Login = { email: string, password: string };
  const login = async (formData: Login) => {
    const { email, password } = formData;
    const { data, error } = await signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
        rememberMe: false,
      },
      {
        //callbacks
      }
    );
    console.log(data, error);
    if (error?.message) {
      setErrorMessage(error.message);
    }
    return {};
  };

  const fields: FormField[] = [
    { name: "email", type: "text", label: "Email" },
    { name: "password", type: "text", label: "Password" },
  ];

  const buttons = [
    () => {
      return (
        <Button key="submit" type="submit" className="mt-3 w-full">
          Login
        </Button>
      );
    },
  ];

  const signinGoogle = async () => {
    //redirect("/api/oauth/google/login");
    const data = await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
      disableRedirect: true,
    });

    if (data.data?.url) {
      router.push(data.data.url);
    }
  };

  const signinGithub = async () => {
    const data = await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
      disableRedirect: true,
    });
    console.log('d', data);
    if (data.data?.url) {
      router.push(data.data.url);
    }
  };

  const register = () => {
    redirect("/signup");
  };

  return (
    <div className="flex flex-col gap-3 p-6 max-w-lg">
      <Link href='/dashboard'>Dashboard</Link>
      <Form
        fields={fields}
        validation={LoginUser}
        buttons={buttons}
        action={login}
      />
      {/*<Button onClick={googleLogin}>Google login</Button>*/}
      {errorMessage && <p className="text-red-500 py-3">{errorMessage}</p>}
      <Button onClick={signinGithub}>Github login</Button>
      <Button onClick={signinGoogle}>Google login</Button>
      <Button onClick={register}>Register</Button>
    </div>
  );
}
