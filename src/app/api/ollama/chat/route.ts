import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";

// Initialize Ollama client on server side
const ollamaClient = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { model, messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OLLAMA_API_KEY) {
      return NextResponse.json(
        { error: "Ollama API key not configured" },
        { status: 500 }
      );
    }

    const response = await ollamaClient.chat({
      model: model || "gpt-oss:120b",
      messages: messages,
      stream: false,
    });

    return NextResponse.json({
      content: response.message.content,
      done: response.done,
    });
  } catch (error) {
    console.error("Ollama API error:", error);
    
    // Return a mock response if API fails (for development)
    if (process.env.NODE_ENV === "development") {
      const mockResponse = "This is a mock AI response for development. Please configure your Ollama API key to get real AI responses.";
      return NextResponse.json({
        content: mockResponse,
        done: true,
      });
    }

    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
