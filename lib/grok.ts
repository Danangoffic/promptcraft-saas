import OpenAI from "openai";

export const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY!,
  baseURL: "https://api.x.ai/v1",
  timeout: 360000
});

export const GROK_MODEL = process.env.GROK_MODEL || "grok-4";
export const GROK_EVAL_MODEL = process.env.GROK_EVAL_MODEL || GROK_MODEL;
