import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { evaluateGeneratedPrompt, generatePromptWithGrok } from "@/lib/generate-prompt";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: schedules, error } = await supabase
    .from("generation_schedules")
    .select("*")
    .eq("is_active", true)
    .lte("next_run_at", now)
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = [];

  for (const schedule of schedules || []) {
    const { data: job, error: jobError } = await supabase
      .from("generated_prompt_jobs")
      .insert({
        schedule_id: schedule.id,
        access_level: schedule.access_level,
        category_id: schedule.category_id,
        status: "generating",
        grok_model: process.env.GROK_MODEL || "grok-4",
        input_prompt: schedule.topic
      })
      .select("*")
      .single();

    if (jobError || !job) {
      results.push({ schedule: schedule.name, status: "failed", error: jobError?.message });
      continue;
    }

    try {
      const generated = await generatePromptWithGrok({
        accessLevel: schedule.access_level,
        topic: schedule.topic,
        modelTarget: schedule.model_target
      });

      const { data: prompt, error: promptError } = await supabase
        .from("prompts")
        .insert({
          category_id: schedule.category_id,
          title: generated.title,
          slug: `${generated.slug}-${Date.now()}`,
          excerpt: generated.excerpt,
          content: generated.prompt,
          negative_prompt: generated.negative_prompt,
          model_target: generated.model_target || schedule.model_target,
          use_case: generated.use_case,
          difficulty: generated.difficulty || "intermediate",
          access_level: schedule.access_level,
          awareness_lesson: generated.awareness_lesson,
          breakdown: generated.breakdown || [],
          variables: generated.variables || [],
          testing_checklist: generated.testing_checklist || [],
          failure_modes: generated.failure_modes || [],
          is_published: false
        })
        .select("*")
        .single();

      if (promptError || !prompt) throw new Error(promptError?.message || "Failed to create prompt");

      for (const variation of generated.variations || []) {
        await supabase.from("prompt_variations").insert({
          prompt_id: prompt.id,
          title: variation.title,
          content: variation.prompt,
          notes: variation.notes
        });
      }

      const evaluation = await evaluateGeneratedPrompt(generated);

      await supabase.from("prompt_evaluations").insert({
        prompt_id: prompt.id,
        job_id: job.id,
        ...evaluation
      });

      const needsReview = schedule.access_level !== "free" || evaluation.overall_score < 7 || evaluation.safety_score < 9;

      await supabase
        .from("generated_prompt_jobs")
        .update({
          status: needsReview ? "needs_review" : "approved",
          raw_output: generated,
          generated_prompt_id: prompt.id,
          updated_at: new Date().toISOString()
        })
        .eq("id", job.id);

      if (!needsReview) {
        await supabase.from("prompts").update({ is_published: true }).eq("id", prompt.id);
      }

      const nextRun = new Date();
      if (schedule.frequency === "daily") nextRun.setDate(nextRun.getDate() + 1);
      else nextRun.setDate(nextRun.getDate() + 7);

      await supabase
        .from("generation_schedules")
        .update({ last_run_at: now, next_run_at: nextRun.toISOString() })
        .eq("id", schedule.id);

      results.push({ schedule: schedule.name, status: needsReview ? "needs_review" : "published", promptId: prompt.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      await supabase
        .from("generated_prompt_jobs")
        .update({ status: "failed", error_message: message, updated_at: new Date().toISOString() })
        .eq("id", job.id);
      results.push({ schedule: schedule.name, status: "failed", error: message });
    }
  }

  return NextResponse.json({ results });
}
