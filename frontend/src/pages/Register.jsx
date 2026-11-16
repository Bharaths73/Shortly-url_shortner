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
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { registerUser } from "@/Api/UserApi";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/signupSchema";

function Register() {
  const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors}, } = useForm({resolver: zodResolver(signupSchema),mode:"onBlur"})

  const {mutate: signUp, isPending, isSuccess, isError, error, data} = useMutation({
    mutationFn: registerUser,
    retry: false,
    onSuccess: (data) => {
        navigate("/login", { replace: true, state: { message: "Registration successful. Please log in." } });
    },
    onError: (error) => {
        console.error("Error during registration:", error);
        console.error("Stack:", error.stack);
    }
  })

  const registerHandler = (data) => {
    console.log("Signup data:", data);
    console.log("Type:", typeof data);
    signUp(data)
  }



  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      {isError && (
        <p className="text-sm text-destructive">
            {error?.response?.data?.message || "Registration failed"}
        </p>
)}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your Details below to register to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={()=>navigate("/login")}>Sign In</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit(registerHandler)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">First Name</Label>
                <Input
                  {...register("firstName")}
                  placeholder="Enter First Name"
                />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Last Name</Label>
                <Input
                  {...register("lastName")}
                  placeholder="Enter Last Name"
                />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  type="text"
                  placeholder="m@example.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input {...register("password")} type="password" required />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input {...register("confirmPassword")} type="password" required />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
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
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
          <Button variant="outline" className="w-full" disabled={isPending}>
            <NavLink to="http://localhost:8085/oauth2/authorization/google">
              {" "}
              Sign Up with Google{" "}
            </NavLink>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
