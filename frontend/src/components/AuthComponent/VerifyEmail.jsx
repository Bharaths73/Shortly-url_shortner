import { verifyEmail } from "@/Api/UserApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CircleAlert, LoaderCircle, MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BrandMark from "@/components/common/BrandMark";

const verificationStates = {
  verifying: {
    label: "Secure verification",
    title: "Verifying your email",
    description:
      "We're checking your verification link. This should only take a moment.",
    icon: LoaderCircle,
    iconClassName: "animate-spin text-primary",
    iconWrapperClassName: "bg-primary/10",
  },
  success: {
    label: "Verification complete",
    title: "You're all set!",
    description:
      "Your email has been verified. You can now sign in and start shortening links.",
    icon: MailCheck,
    iconClassName: "text-emerald-600 dark:text-emerald-400",
    iconWrapperClassName: "bg-emerald-500/10",
  },
  error: {
    label: "Link unavailable",
    title: "We couldn't verify your email",
    description:
      "This verification link may be invalid or expired. Head back to sign in to continue.",
    icon: CircleAlert,
    iconClassName: "text-destructive",
    iconWrapperClassName: "bg-destructive/10",
  },
};

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const currentState = verificationStates[status];
  const StatusIcon = currentState.icon;

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await verifyEmail(token);
        setStatus("success");
        navigate("/login", {
          replace: true,
          state: {
            message: "Verification successful. You can now log in.",
          },
        });
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    verify();
  }, [searchParams, navigate]);

  const handleSignIn = () => navigate("/login", { replace: true });

  return (
    <main className="verify-page">
      <div className="relative mx-auto flex w-full max-w-sm flex-col items-center gap-5">
        <BrandMark />

        <Card
          aria-busy={status === "verifying"}
          aria-live="polite"
          className="verify-card gap-0 overflow-hidden"
          role={status === "error" ? "alert" : "status"}
        >
          <div className="mb-5 h-1 w-full rounded-full bg-gradient-to-r from-primary/30 via-primary to-chart-2/70" />
          <CardHeader className="p-0 text-center">
            <div className="flex w-full flex-col items-center gap-1 text-center">
              <div
                className={`verify-symbol mb-2 ring-1 ring-border/60 ${currentState.iconWrapperClassName}`}
              >
                <StatusIcon
                  className={`size-6 ${currentState.iconClassName}`}
                />
              </div>
              <span className="mx-auto w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {currentState.label}
              </span>
              <CardTitle className="pt-1 text-2xl font-semibold tracking-tight">
                {currentState.title}
              </CardTitle>
              <CardDescription className="max-w-sm text-sm leading-6">
                {currentState.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardFooter className="mt-5 flex-col gap-3 border-0 bg-transparent p-0">
            {status === "verifying" ? (
              <p className="text-center text-sm text-muted-foreground">
                Please keep this page open while we securely validate your link.
              </p>
            ) : (
              <Button className="w-full" size="lg" onClick={handleSignIn}>
                Continue to sign in
                <ArrowRight data-icon="inline-end" />
              </Button>
            )}
            <p className="text-center text-xs text-muted-foreground">
              Verification links can only be used once.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
