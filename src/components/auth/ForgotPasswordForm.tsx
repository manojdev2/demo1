"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestPasswordReset } from "@/actions/auth.actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { ForgotPasswordFormSchema } from "@/models/forgotPasswordForm.schema";
import Loading from "../Loading";
import Link from "next/link";

function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: z.infer<typeof ForgotPasswordFormSchema>) => {
    setErrorMessage("");
    setSuccessMessage("");
    startTransition(async () => {
      try {
        const result = await requestPasswordReset(data.email);
        setSuccessMessage(result.message);
        form.reset();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to send password reset email. Please try again."
        );
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="id@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loading /> : "Send Reset Link"}
            </Button>
            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-sm text-green-500">{successMessage}</p>
              )}
            </div>
            <div className="text-center text-sm">
              <Link href="/signin" className="underline">
                Back to sign in
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export default ForgotPasswordForm;










