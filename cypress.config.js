import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "test/e2e/**/*.cy.{js,jsx,ts,tsx}", // Use your custom folder
    baseUrl: "http://localhost:5173", // Adjust to your app's URL
  },
});
