"use client";
import Form, { DefaultFormData } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth-client";
import { FormField } from "@/types/resources";
import { RegisterUser } from "@/validation";
import { type FormState } from "react-hook-form";

export default function RegisterPage() {
  const fields: FormField[] = [
    //{ name: 'firstName', type: 'text', label: 'First name' },
    { name: "name", type: "text", label: "User name" },
    { name: "email", type: "text", label: "Email" },
    { name: "password", type: "text", label: "Password" },
    //{ name: 'confirm', type: 'checkbox', label: 'Confirm submit' }
  ];

  const buttons = [
    ({ isValid, isLoading }: Partial<FormState<DefaultFormData>>) => {
      console.log(isValid);
      console.log(isLoading);
      return (
        <Button key="submit" type="submit" className="mt-3">
          Register user
        </Button>
      );
    },
  ];

  type Register = { email: string; password: string; name: string };

  const onRegister = async (formData: Register) => {
    const { email, password, name } = formData;
    const { data, error } = await signUp.email(
      {
        email,
        password,
        name,
        //image, // User image URL (optional)
        callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: (ctx) => {
          console.log(ctx);
          //show loading
        },
        onSuccess: (ctx) => {
          console.log(ctx);
          //redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      }
    );
    console.log(data, error);
    return { };
  };

  return (
    <div className="p-6">
      <Form
        fields={fields}
        validation={RegisterUser}
        buttons={buttons}
        action={onRegister}
      />
    </div>
  );
}
