import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import { OUTPUT_LANGUAGE_PROMPT, type Locale } from "@/lib/i18n";

async function generateSingle(
  provider: string,
  apiKey: string,
  prompt: string,
  model: string
): Promise<string> {
  if (provider === "openai") {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0]?.message?.content || "";
  } else if (provider === "openrouter") {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
    });
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0]?.message?.content || "";
  } else if (provider === "gemini") {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "";
  } else if (provider === "claude") {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });
    // Extract text from content blocks
    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock?.type === "text" ? textBlock.text : "";
  }
  return "";
}

function extractJSON(text: string) {
  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from AI response:", text);
    throw new Error("AI returned invalid JSON format. Please try again.");
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { provider, apiKey, model, videoType, duration, topic, keywords, audience, tone } = body;
    const variations = Math.min(Math.max(Number(body.variations) || 1, 1), 3);
    const wordLimit = body.wordLimit ? Number(body.wordLimit) : null;
    const outputLocale = (body.outputLanguage || "en") as Locale;
    const outputLangStr = OUTPUT_LANGUAGE_PROMPT[outputLocale] ?? "English";

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Provider and API Key are required. Please configure them in Settings." },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json(
        { error: "Model is required. Please select a model in Settings." },
        { status: 400 }
      );
    }

    if (!topic || !videoType || !duration) {
      return NextResponse.json(
        { error: "Video type, duration, and topic are required." },
        { status: 400 }
      );
    }

    const buildPrompt = (variationIndex: number) => {
      let prompt = `You are an expert video script writer. Generate a script and scene breakdown for a ${videoType} about the topic: "${topic}".
The total video duration should be approximately ${duration}. Target audience: ${audience || "General"}. Preferred tone: ${tone || "Neutral"}.
${keywords ? `Ensure you include the following keywords natively across the script: ${keywords}.` : ""}
${wordLimit ? `Try to keep the total voiceover word count around ${wordLimit} words.` : ""}
You MUST write ALL text content (title, hook, voiceover, on-screen text, etc.) entirely in ${outputLangStr}. Do NOT use any other language.

You MUST output your response strictly in the following JSON format. Do not add any text before or after the JSON.
{
  "title": "Video Title",
  "hook": "Opening hook description",
  "keyMessage": "The main message of the video",
  "callToAction": "What the user should do at the end",
  "sceneCount": number,
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Scene Title",
      "duration": "Duration in seconds (e.g., 5s)",
      "visualDescription": "What is shown on screen",
      "voiceover": "The spoken naration for this scene. (Leave empty if none)",
      "onScreenText": "Text shown on screen (Leave empty if none)",
      "transition": "Transition to next scene (e.g., Cut, Fade)",
      "bgm": "Background music suggestion"
    }
  ]
}`;

      if (variations > 1) {
        prompt += `\nThis is variation ${variationIndex + 1} of ${variations}. Please create a unique and distinct version — use a different opening hook and scene structure than other variations.`;
      }

      return prompt;
    };

    if (!["openai", "gemini", "claude", "openrouter"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    // Generate all variations in parallel
    const promises = Array.from({ length: variations }, (_, i) =>
      generateSingle(provider, apiKey, buildPrompt(i), model)
    );
    const results = await Promise.all(promises);

    const validResults = results.filter((text) => text.trim().length > 0);
    if (validResults.length === 0) {
      return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
    }

    const parsedResults = validResults.map(extractJSON);

    // Save each variation to database
    const savedGenerations = await Promise.all(
      parsedResults.map((result) => {
        const fullScript = result.scenes
          .map((s: any) => `[Scene ${s.sceneNumber}] ${s.voiceover}`)
          .join("\n\n");
        return prisma.generation.create({
          data: {
            userId: session.user.id,
            videoType,
            duration,
            topic,
            keywords,
            audience,
            tone,
            outputScript: fullScript,
            outputScenes: result,
            sceneCount: result.sceneCount || result.scenes.length,
          },
        });
      })
    );

    // Return the parsed results and matching IDs to the client
    return NextResponse.json({
      results: parsedResults,
      ids: savedGenerations.map((g) => g.id),
      result: parsedResults[0],
      id: savedGenerations[0].id,
    });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred during generation" },
      { status: 500 }
    );
  }
}
