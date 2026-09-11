import { NextRequest, NextResponse } from "next/server";

async function callGemini(promptText: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in server environment.");
    }

    const models = [
        "gemini-3.5-flash",
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash-lite",
        "gemini-flash-latest",
        "gemini-3.1-flash-lite"
    ];

    let lastError: Error | null = null;

    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2500
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) return text.trim();
            } else {
                const errData = await response.text();
                lastError = new Error(`Gemini (${model}) error: ${response.status} - ${errData}`);
            }
        } catch (err: any) {
            lastError = err;
        }
    }

    throw lastError || new Error("All Gemini models failed to generate content.");
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            topic,
            category = "Education",
            tone = "Inspirational and Educational",
            targetAudience = "Students, Parents, and Teachers",
            action = "full_article", // 'full_article' | 'polish_draft' | 'suggest_titles'
            existingDraft = "",
            keywords = ""
        } = body;

        if (!topic && !existingDraft && action !== "suggest_titles") {
            return NextResponse.json(
                { success: false, message: "Please provide a topic or prompt for AI generation." },
                { status: 400 }
            );
        }

        let prompt = "";

        if (action === "polish_draft") {
            prompt = `You are a professional educational copywriter and blog editor for EduManage School.
Enhance, structure, and polish the following blog draft. Keep the core message but make it highly engaging, well-formatted, and grammatically flawless.

Topic: ${topic || "School Education"}
Category: ${category}
Tone: ${tone}
Audience: ${targetAudience}

Current Draft:
"""
${existingDraft}
"""

Return your response ONLY in valid JSON format matching this schema:
{
  "title": "Polished, catchy blog title",
  "description": "Engaging 2-sentence summary/excerpt (under 200 characters)",
  "content": "Full formatted markdown content with headings, paragraphs, and bullet points",
  "category": "${category}",
  "tags": ["tag1", "tag2", "tag3"]
}`;
        } else if (action === "suggest_titles") {
            prompt = `You are an expert school blog content strategist for EduManage.
Generate 5 compelling, modern, and click-worthy educational blog titles based on:
Topic: ${topic || "School Education and Student Success"}
Category: ${category}

Return your response ONLY in valid JSON format:
{
  "titles": [
    "Title 1",
    "Title 2",
    "Title 3",
    "Title 4",
    "Title 5"
  ],
  "suggestedCategory": "${category}",
  "suggestedTags": ["tag1", "tag2", "tag3"]
}`;
        } else {
            // Full Article Generation
            prompt = `You are an acclaimed educational author, school principal, and thought leader writing for the EduManage School Management platform blog.
Write a comprehensive, captivating, and high-impact educational blog article.

Topic: ${topic}
Category: ${category}
Tone: ${tone}
Target Audience: ${targetAudience}
${keywords ? `Keywords to include: ${keywords}` : ""}

Guidelines:
1. Provide an inspiring, descriptive title.
2. Provide a 2-sentence captivating description / summary.
3. Write an in-depth article body (around 400 to 700 words) formatted in markdown with clear introductory hook, structured subheadings (## Subheading), well-spaced paragraphs, actionable takeaways, and a warm concluding thought.
4. Include 4-6 relevant tag strings.

Return your response ONLY in valid JSON format (do not include extra text outside the JSON object):
{
  "title": "Title here",
  "description": "Short compelling summary here",
  "content": "Full markdown content with sections and bullet points here",
  "category": "${category}",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}`;
        }

        const rawResponse = await callGemini(prompt);

        // Parse JSON from response
        let cleaned = rawResponse.trim();
        if (cleaned.includes("```json")) {
            cleaned = cleaned.replace(/^[\s\S]*?```json\s*/i, "").replace(/\s*```[\s\S]*$/, "").trim();
        } else if (cleaned.includes("```")) {
            cleaned = cleaned.replace(/^[\s\S]*?```\s*/, "").replace(/\s*```[\s\S]*$/, "").trim();
        }

        let parsedResult: any = null;
        try {
            parsedResult = JSON.parse(cleaned);
        } catch {
            const match = cleaned.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    parsedResult = JSON.parse(match[0]);
                } catch (innerErr) {
                    console.error("Regex JSON extract failed:", innerErr);
                }
            }
            if (!parsedResult) {
                parsedResult = {
                    title: topic || "Educational Article",
                    description: "An insightful educational article from EduManage.",
                    content: rawResponse,
                    category: category || "Education",
                    tags: ["Education", "School", "Learning"]
                };
            }
        }

        return NextResponse.json({
            success: true,
            data: parsedResult
        });
    } catch (error: any) {
        console.error("Error in POST /api/blogs/ai-generate:", error);
        return NextResponse.json(
            { success: false, message: error.message || "AI blog generation failed. Please check your Gemini API key." },
            { status: 500 }
        );
    }
}
