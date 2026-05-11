import { grok, GROK_MODEL, GROK_EVAL_MODEL } from "@/lib/grok";

export type AccessLevel = "free" | "premium" | "enthusiast";

export type GeneratedPromptAsset = {
  title: string;
  slug: string;
  excerpt?: string;
  prompt: string;
  negative_prompt?: string;
  model_target?: string;
  use_case?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  variables?: unknown[];
  breakdown?: unknown[];
  variations?: { title: string; prompt: string; notes?: string }[];
  testing_checklist?: unknown[];
  failure_modes?: unknown[];
  awareness_lesson?: string;
};

export type PromptEvaluation = {
  clarity_score: number;
  specificity_score: number;
  creativity_score: number;
  usability_score: number;
  safety_score: number;
  awareness_score: number;
  overall_score: number;
  evaluation_notes: string;
  improvement_suggestions: string;
};

export async function generatePromptWithGrok(input: {
  accessLevel: AccessLevel;
  topic: string;
  modelTarget?: string | null;
}) {
  const completion = await grok.chat.completions.create({
    model: GROK_MODEL,
    temperature: 0.8,
    messages: [
      { role: "system", content: getSystemPrompt(input.accessLevel) },
      {
        role: "user",
        content: JSON.stringify({
          access_level: input.accessLevel,
          topic: input.topic,
          model_target: input.modelTarget || "General AI tools"
        })
      }
    ]
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Grok returned empty content");
  return JSON.parse(content) as GeneratedPromptAsset;
}

export async function evaluateGeneratedPrompt(asset: GeneratedPromptAsset) {
  const completion = await grok.chat.completions.create({
    model: GROK_EVAL_MODEL,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "You are a strict prompt quality evaluator. Return valid JSON only with clarity_score, specificity_score, creativity_score, usability_score, safety_score, awareness_score, overall_score, evaluation_notes, and improvement_suggestions. Scores must be 1 to 10."
      },
      { role: "user", content: JSON.stringify(asset) }
    ]
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Grok returned empty evaluation");
  return JSON.parse(content) as PromptEvaluation;
}

function getSystemPrompt(accessLevel: AccessLevel) {
  const base = "You are an expert prompt engineer for a SaaS prompt library. Return valid JSON only. Do not wrap in markdown. Always include title, slug, excerpt, prompt, use_case, difficulty, variables, breakdown, and awareness_lesson.";

  if (accessLevel === "free") {
    return `${base} Create a beginner-friendly Free tier prompt. It must be practical, easy to understand, and teach one prompt awareness principle.`;
  }

  if (accessLevel === "premium") {
    return `${base} Create a Premium prompt asset. It must be commercially useful and include negative_prompt, variations, and a deeper breakdown.`;
  }

  return `${base} Create an Enthusiast prompt asset. It must include advanced strategy, negative_prompt, variations, testing_checklist, failure_modes, and deep prompt awareness.`;
}
