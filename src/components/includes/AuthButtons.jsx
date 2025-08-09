

import { AWS_COGNITO_CLIENT_ID, AWS_COGNITO_DOMAIN } from "@/aws/constant";
import { useAuth } from "react-oidc-context";

export function AuthButtons({ className }) {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = AWS_COGNITO_CLIENT_ID
    const logoutUri = "http://localhost:5173/dashboard";
    const cognitoDomain = AWS_COGNITO_DOMAIN
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}

