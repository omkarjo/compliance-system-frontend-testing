import { Amplify } from "aws-amplify";
import {
  AWS_BUCKET_NAME,
  AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_IDENTITY_POOL_ID,
  AWS_COGNITO_USER_POOL_ID,
  AWS_REGION,
} from "./constant";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: AWS_COGNITO_CLIENT_ID,
      identityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
      region: AWS_REGION,
    },
  },
  Storage: {
    S3: {
      bucket: AWS_BUCKET_NAME,
      region: AWS_REGION,
    },
  },
});
