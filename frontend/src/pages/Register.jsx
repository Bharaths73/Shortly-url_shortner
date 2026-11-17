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
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { registerUser } from "@/Api/UserApi";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/signupSchema";
import BrandMark from "@/components/common/BrandMark";
import heroArt from "@/assets/hero.png";
import { Sparkles } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const { mutate: signUp, isPending, isError, error } = useMutation({
    mutationFn: registerUser,
    retry: false,
    onSuccess: () => {
      navigate("/login", {
        replace: true,
        state: {
          message: "Registration successful. Please verify your email from link sent to your mail.",
        },
      });
    },
    onError: (error) => {
      console.error("Error during registration:", error);
      console.error("Stack:", error.stack);
    },
  });

  const registerHandler = (data) => {
    console.log("Signup data:", data);
    console.log("Type:", typeof data);
    signUp(data);
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <BrandMark />
        <div className="auth-visual__content">
          <div className="auth-visual__eyebrow">
            <Sparkles aria-hidden="true" className="size-4" />
            A better place for your URLs
          </div>
          <h2 className="auth-visual__title">
            Keep your links
            <br />
            <span>moving forward.</span>
          </h2>
          <p className="auth-visual__description">
            Create an account and bring your links together in one clear,
            easy-to-use workspace.
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
            <h1 className="auth-heading">Create your account</h1>
            <p className="auth-subheading">
              Just a few details to get your link workspace ready.
            </p>
          </header>

          {isError && (
            <p role="alert" className="auth-error">
              {error?.response?.data?.message || "Registration failed"}
            </p>
          )}

          <Card className="auth-card">
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Enter your details below to register to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="login-form" onSubmit={handleSubmit(registerHandler)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      className="auth-input"
                      id="firstName"
                      autoComplete="given-name"
                      placeholder="Enter your first name"
                      aria-invalid={Boolean(errors.firstName)}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="auth-field-error">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      className="auth-input"
                      id="lastName"
                      autoComplete="family-name"
                      placeholder="Enter your last name"
                      aria-invalid={Boolean(errors.lastName)}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="auth-field-error">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      className="auth-input"
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="auth-field-error">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      className="auth-input"
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      aria-invalid={Boolean(errors.password)}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="auth-field-error">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      className="auth-input"
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      aria-invalid={Boolean(errors.confirmPassword)}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="auth-field-error">{errors.confirmPassword.message}</p>
                    )}
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
                {isPending ? "Creating account…" : "Create account"}
              </Button>
              <div className="auth-divider">or continue with</div>
              <Button variant="outline" className="auth-google w-full" disabled={isPending}>
                <NavLink to="http://localhost:8085/oauth2/authorization/google">
                  <span className="auth-google-mark" aria-hidden="true">G</span>
                  Sign up with Google
                </NavLink>
              </Button>
            </CardFooter>
          </Card>
          <p className="auth-switch">
            Already have an account?
            <Button variant="link" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
