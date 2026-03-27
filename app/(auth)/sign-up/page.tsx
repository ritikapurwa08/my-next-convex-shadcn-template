"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { StaticImageData } from "next/image";
import * as z from "zod";

import AvatarPicker from "@/components/profile/avatar-selector";
import { profileImages } from "@/components/profile/profile-images";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ✅ ZOD SCHEMA
const formSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const [avatar, setAvatar] = React.useState<StaticImageData | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [globalError, setGlobalError] = React.useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!avatar) {
      setGlobalError("Please select an avatar");
      return;
    }

    try {
      setLoading(true);

      await signIn("password", {
        name: data.name,
        email: data.email,
        password: data.password,
        image: avatar.src, // 🔥 critical
        flow: "signUp",
      });

      router.push("/quiz");
    } catch (err) {
      setGlobalError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 🔵 Avatar Picker */}
      <div className="flex justify-center">
        <AvatarPicker
          images={profileImages}
          value={avatar}
          onChange={setAvatar}
        />
      </div>

      {/* ❌ Global Error */}
      {globalError && (
        <p className="text-sm text-red-500 text-center">{globalError}</p>
      )}

      {/* ✅ FORM */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* NAME */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  placeholder="Alex Rivera"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* EMAIL */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="name@university.edu"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* PASSWORD */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* ✅ SUBMIT */}
        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
