import { fetchAuthSession } from "aws-amplify/auth";

export async function ensureAWSCredentials() {
  try {
    const session = await fetchAuthSession();

    if (!session.credentials) {
      throw new Error("No AWS credentials found after auth.");
    }

    console.log("AWS credentials loaded:", session.credentials);
  } catch (err) {
    console.error("Failed to load AWS credentials:", err);
  }
}
