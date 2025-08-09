export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_poFlks6wM",
  client_id: "572dl9nnca4o9fsobc26tfj8oh",
  redirect_uri: "http://localhost:5173/dashboard",
  post_logout_redirect_uri: "http://localhost:5173/dashboard",
  response_type: "code",
  scope: "email openid phone",
};
