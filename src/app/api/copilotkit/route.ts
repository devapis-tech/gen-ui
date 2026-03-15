export const runtime = "nodejs";

import { CopilotRuntime } from "@copilotkit/runtime";
import { NextRequest } from "next/server";

const copilotRuntime = new CopilotRuntime();

copilotRuntime.addAgent({
  name: "default",
  description: "Clinical Trial Assistant",
  instructions:
    "You are a helpful assistant that helps users complete clinical trial forms.",
});

export async function POST(req: NextRequest) {
  return copilotRuntime.handleRequest(req);
}

export async function GET(req: NextRequest) {
  return copilotRuntime.handleRequest(req);
}
