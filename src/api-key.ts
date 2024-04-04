import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export const CHATGPT_API_KEY: string =
  process.env.CHATGPT_API_KEY || "INSERT-YOUR-API-KEY-HERE";
