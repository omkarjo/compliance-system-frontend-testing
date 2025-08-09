import { AWS_COGNITO_CLIENT_ID, AWS_COGNITO_DOMAIN } from "@/aws/constant";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertTriangle, LogIn } from "lucide-react";
import { useAuth } from "react-oidc-context";

export function AuthWrapper({ children, className }) {
  const auth = useAuth();

  const signOutRedirect = async () => {
    await auth.removeUser();
    const clientId = AWS_COGNITO_CLIENT_ID;
    const logoutUri = window.location.origin + "/dashboard";
    const domain = AWS_COGNITO_DOMAIN;
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };
  if (auth.isLoading) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <Skeleton className="h-12 w-48 rounded-md" />
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="bg-background text-foreground flex h-screen flex-col items-center justify-center px-4 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Authentication Error</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          {auth.error.message || "An error occurred while logging in."}
        </p>
        <Button className="mt-4" onClick={() => auth.signinRedirect()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="bg-background text-foreground flex h-screen flex-col items-center justify-center px-4 text-center">
        <LogIn className="text-primary mb-4 h-12 w-12" />
        <h2 className="text-2xl font-bold">Welcome</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          Sign in to access your account.
        </p>
        <Button className="mt-6" onClick={() => auth.signinRedirect()}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", className)}>
      <div className="border-border text-muted-foreground flex items-center justify-between p-4 text-sm">
        <div>Hello, {auth.user?.profile.email}</div>
        <Button variant="outline" size="sm" onClick={signOutRedirect}>
          Sign Out
        </Button>
      </div>
      {children}
    </div>
  );
}
