import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  reporter: "html",
  projects: [
    { name: "auth-setup", testMatch: "**/auth.setup.ts" },
    { name: "kitchen-setup", testMatch: "**/kitchen.setup.ts" },
    {
      name: "order-setup",
      testMatch: "**/order.setup.ts",
      dependencies: ["auth-setup", "kitchen-setup"],
    },
    {
      name: "kitchen-tests",
      testMatch: "**/kitchen.spec.ts",
      dependencies: ["kitchen-setup"],
    },
    {
      name: "customer-tests",
      testMatch: "**/@(order|payment).spec.ts",
      dependencies: ["auth-setup", "kitchen-setup", "order-setup"],
    },
  ],
});
