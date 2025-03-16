import InputPassword from "@/components/extension/input-password";
import { PhoneInput } from "@/components/extension/phone-input";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { registerSchema } from "@/schemas/zod/authSchema";
import { useAppSelector } from "@/store/hooks";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm, useFormState } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { label: "Fund Manager", value: "Fund Manager" },
  { label: "Compliance Officer", value: "Compliance Officer" },
  { label: "Limited Partner", value: "LP" },
  { label: "Portfolio Company", value: "Portfolio Company" },
  { label: "Auditor", value: "Auditor" },
  { label: "Legal Consultant", value: "Legal Consultant" },
];

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "",
    },
  });

  const { isSubmitting } = useFormState({
    control: form.control,
  });

  const handelSubmit = useCallback(async (data) => {
    console.log(data);
    try {
      await api.post("/users", data);
      toast.success("Registration successful", {
        description: "Please login to continue",
      });
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed", {
        description: error?.response?.data?.detail,
      });
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handelSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>
                        Name
                        <span className="text-red-500">*</span>
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>
                        Email
                        <span className="text-red-500">*</span>
                      </span>
                    </FormLabel>
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
                    <FormLabel>
                      <span>
                        Password
                        <span className="text-red-500">*</span>
                      </span>
                    </FormLabel>
                    <FormControl>
                      <InputPassword {...field} autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>
                        Phone
                        <span className="text-red-500">*</span>
                      </span>
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        defaultCountry="IN"
                        autoComplete="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      <span>
                        Role
                        <span className="text-red-500">*</span>
                      </span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={cn("w-full")}>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLE_OPTIONS.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Please select your role.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Register"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
