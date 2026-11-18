import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { loginAction } from "@/Api/UserApi";
import BrandMark from "@/components/common/BrandMark";
import heroArt from "@/assets/hero.png";
import { Sparkles } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { error } = useParams();
  const location = useLocation();
  const [message] = useState(location.state?.message || "");

  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    user: null,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      navigate("/home", { replace: true });
    }
  }, [state.success, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location, navigate]);

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <BrandMark />
        <div className="auth-visual__content">
          <div className="auth-visual__eyebrow">
            <Sparkles aria-hidden="true" className="size-4" />
            Thoughtful links. Less clutter.
          </div>
          <h2 className="auth-visual__title">
            Make sharing
            <br />
            feel <span>effortless.</span>
          </h2>
          <p className="auth-visual__description">
            A calm, simple home for every link you create. Sign in to pick up
            right where you left off.
          </p>
          <div className="auth-visual__art" aria-hidden="true">
            <img src={heroArt} alt="" />
          </div>
        </div>
        <p className="auth-visual__footer">Shortly · Links, made simple.</p>
      </section>

      <section className="auth-panel">
        <div className="auth-form-shell">
          <div className="auth-mobile-brand">
            <BrandMark />
          </div>
          <header className="auth-intro">
            <h1 className="auth-heading">Welcome back</h1>
            <p className="auth-subheading">
              Sign in to manage your links and see how they’re doing.
            </p>
          </header>

          {message && (
            <p role="status" className="auth-notice">
              {message}
            </p>
          )}
          {error && <p role="alert" className="auth-error">Failed to login</p>}
          {state.message && !state.success && (
            <p role="alert" className="auth-error">{state.message}</p>
          )}

          <Card className="auth-card">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="login-form" action={formAction}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      className="auth-input"
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      name="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    {/* <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div> */}
                    <Input
                      className="auth-input"
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      name="password"
                      placeholder="Enter Password"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                form="login-form"
                className="auth-submit w-full"
                disabled={isPending}
              >
                {isPending ? "Signing in…" : "Sign in"}
              </Button>
              <div className="auth-divider">or continue with</div>
              <Button variant="outline" className="auth-google w-full" disabled={isPending}>
                <a href={import.meta.env.VITE_OAUTH_URL}>
                  <span className="auth-google-mark" aria-hidden="true">G</span>
                  Continue with Google
                </a>
              </Button>
            </CardFooter>
          </Card>
          <p className="auth-switch">
            New to Shortly?
            <Button variant="link" onClick={() => navigate("/register")}>
              Create an account
            </Button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
