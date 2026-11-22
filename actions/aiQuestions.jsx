"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";

const CATEGORY_PROMPTS = {
  FRONTEND: "React, JavaScript, CSS, performance, accessibility, browser APIs",
  BACKEND:
    "Node.js, REST APIs, databases, authentication, caching, scalability",
  FULLSTACK:
    "full-stack architecture, API design, state management, deployment",
  DSA: "data structures, algorithms, time complexity, problem solving",
  SYSTEM_DESIGN:
    "distributed systems, scalability, databases, microservices, caching",
  BEHAVIORAL:
    "leadership, teamwork, conflict resolution, career growth, STAR method",
  DEVOPS: "CI/CD, Docker, Kubernetes, cloud infrastructure, monitoring",
  MOBILE:
    "React Native, iOS/Android, performance, offline support, app lifecycle",
};

export const generateInterviewQuestions = async ({ category }) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized. Please sign in again.", questions: [] };
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        error:
          "GEMINI_API_KEY is not configured in Vercel environment variables. Please add GEMINI_API_KEY in Vercel Project Settings > Environment Variables.",
        questions: [],
      };
    }

    if (!category || !CATEGORY_PROMPTS[category]) {
      return { error: "Invalid category selected.", questions: [] };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are an expert technical interviewer. Generate 6 interview questions for a ${category} role covering: ${CATEGORY_PROMPTS[category]}.

For each question, provide a concise but complete answer (2-4 sentences) that an interviewer can use to evaluate responses.

Respond ONLY with a valid JSON array. Format:
[{"question": "...", "answer": "..."}]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    let questions = [];
    try {
      questions = JSON.parse(text);
    } catch {
      const clean = text.replace(/^```json|^```|```$/gm, "").trim();
      questions = JSON.parse(clean);
    }

    return { questions, success: true };
  } catch (err) {
    console.error("Error generating interview questions:", err);
    return {
      error:
        err.message ||
        "Failed to generate questions. Please verify GEMINI_API_KEY in Vercel.",
      questions: [],
    };
  }
};

