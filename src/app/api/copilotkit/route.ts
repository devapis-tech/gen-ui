import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: new CopilotRuntime({
      remoteAdapter: new OpenAIAdapter({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    }),
    serviceAdapter: new OpenAIAdapter({
      apiKey: process.env.OPENAI_API_KEY,
    }),
    endpoint: req.nextUrl.pathname,
  });

  return handleRequest(req);
};
