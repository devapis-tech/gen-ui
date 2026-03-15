// Client-side Ollama integration - uses API routes instead of direct client calls

export interface OllamaMessage {
  role: "user" | "assistant";
  content: string;
}

export interface OllamaResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

// Client-side function to call our API route
export async function generateAIResponse(
  model: string,
  messages: OllamaMessage[]
): Promise<string> {
  try {
    const response = await fetch("/api/ollama/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "gpt-oss:120b",
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Ollama API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function extractFromPDF(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to parse PDF');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

export async function extractClinicalTrialData(input: string): Promise<any> {
  const messages: OllamaMessage[] = [
    {
      role: "user",
      content: `Extract clinical trial information from this input and format as JSON: ${input.substring(0, 8000)}. 
      Include fields: nctId, protocolTitle, sponsorName, phase, studyType, conditions, enrollmentCount, startDate, completionDate, overallStatus, piName, piAffiliation, indNumber. Also include studyDetails with briefSummary, detailedDescription, primaryOutcomes (array), secondaryOutcomes (array). Return only valid JSON.`,
    },
  ];

  try {
    const response = await generateAIResponse("gpt-oss:120b", messages);
    // Clean the response to ensure it's valid JSON
    const cleanResponse = response.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", error);
    throw new Error("Invalid AI response format");
  }
}
