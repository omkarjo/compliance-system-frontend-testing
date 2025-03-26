import InputPassword from "@/components/extension/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas/zod/authSchema";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTokenAndFetchUser } from "@/store/slices/userSlice";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm, useFormState } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = useFormState({
    control: form.control,
  });

  const handelSubmit = useCallback(
    async (data) => {
      const payload = new URLSearchParams();
      payload.append("username", data.email);
      payload.append("password", data.password);
      try {
        const response = await api.post("/api/auth/login", payload, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*",
          },
        });

        dispatch(setTokenAndFetchUser(response.data.access_token));

        toast.success("Login successful");
        console.log(response.data);
      } catch (error) {
        toast.error("Login failed", {
          description: error?.response?.data?.detail || "Something went wrong",
        });
      }
    },
    [dispatch],
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="w-11/12 max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handelSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link to="/forgot-password" className="text-sm">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <InputPassword
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Login"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
