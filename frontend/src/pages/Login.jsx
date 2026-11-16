import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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

function Login() {
  const navigate = useNavigate();
  const { error } = useParams();
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");

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
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      {message && (
        <p className="text-sm text-destructive">{message}</p>
      )}
      {error && <div className="text-red-500 mb-4">Failed to login</div>}
      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={()=>navigate("/register")}>Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="login-form" action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required name="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            form="login-form"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
          <Button variant="outline" className="w-full" disabled={isPending}>
            <NavLink to="http://localhost:8085/oauth2/authorization/google">
              {" "}
              Login with Google{" "}
            </NavLink>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
