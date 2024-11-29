import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

// Define the expected structure of the OpenAI response
interface OpenAIChatCompletionResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

// POST handler for OpenAI chat completions
export async function POST(req: Request) {
  try {
    // Parse the request body
    const {
      model = "gpt-4", // Default to GPT-4 if no model is provided
      temperature = 1, // Default temperature to 1
      systemPrompt,
      userPrompt,
      responseFormat = "json", // Default to JSON response format
    } = await req.json();

    // Log the incoming request body for debugging
    console.log('Received Request:', { model, systemPrompt, userPrompt, temperature, responseFormat });

    // Validate required fields
    if (!model || !systemPrompt || !userPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: model, systemPrompt, or userPrompt' },
        { status: 400 }
      );
    }

    // Make the OpenAI API call
    const completion = (await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: "system", content: systemPrompt }, // System instructions
        { role: "user", content: userPrompt }, // User input
      ],
      ...(responseFormat && { response_format: responseFormat }), // Optional response format
    })) as OpenAIChatCompletionResponse;

    // Log the OpenAI API response for debugging
    console.log('OpenAI API Response:', completion);

    // Extract and return the response
    const result = completion.choices?.[0]?.message?.content || "No valid response received.";
    return NextResponse.json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Return detailed error information
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate response',
      },
      { status: 500 }
    );
  }
}
