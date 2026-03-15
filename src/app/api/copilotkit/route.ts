export const dynamic = "force-dynamic";

import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

export const POST = async (req: NextRequest) => {
  const openai = new OpenAI({
    apiKey: process.env.OLLAMA_API_KEY || "dummy-key",
    baseURL: process.env.OLLAMA_BASE_URL || "https://ollama.com/v1",
    defaultHeaders: {
      "Cookie": "aid=cb42d98a-a5b2-47ae-8aea-48701f756cac"
    }
  });

  const serviceAdapter = new OpenAIAdapter({
    openai: openai as any,
    model: process.env.LLM_MODEL || "gpt-oss:120b"
  });
  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};

export const GET = async (req: NextRequest) => {
  const openai = new OpenAI({
    apiKey: process.env.OLLAMA_API_KEY || "dummy-key",
    baseURL: process.env.OLLAMA_BASE_URL || "https://ollama.com/v1",
    defaultHeaders: {
      "Cookie": "aid=cb42d98a-a5b2-47ae-8aea-48701f756cac"
    }
  });

  const serviceAdapter = new OpenAIAdapter({
    openai: openai as any,
    model: process.env.LLM_MODEL || "gpt-oss:120b"
  });
  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};

