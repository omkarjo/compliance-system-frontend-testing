import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

export function getS3Client({ idToken }) {
  return new S3Client({
    region: "us-east-1",
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: "us-east-1" },
      identityPoolId: "us-east-1:c78a8d10-c514-4f08-8877-844025e7b9b6",
      logins: idToken
        ? {
            // This format: "cognito-idp.{region}.amazonaws.com/{userPoolId}": idToken
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_poFlks6wM": idToken,
          }
        : undefined,
    }),
  });
}