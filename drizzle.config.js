import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://neondb_owner:O2x1mdpZnYaw@ep-misty-king-a5px0h0r.us-east-2.aws.neon.tech/ai%20form%20builder?sslmode=require'
  }
});