import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password",
};

function ResetPasswordContent() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
        <CardDescription>
          Create a new password for your account. Make sure it&apos;s strong and secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Loading...
          </CardDescription>
        </CardHeader>
      </Card>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}










