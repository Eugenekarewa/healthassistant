import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with the API key
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

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { model, temperature, systemPrompt, userPrompt, responseFormat } = await req.json();

    // Log the incoming request body for debugging
    console.log('Received Request:', { model, systemPrompt, userPrompt, temperature, responseFormat });

    // Validate the input
    if (!model || !systemPrompt || !userPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: model, systemPrompt, or userPrompt' },
        { status: 400 }
      );
    }

    // Make the OpenAI API call
    const completion = (await openai.chat.completions.create({
      model,
      temperature: temperature || 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      ...(responseFormat && { response_format: responseFormat }),
    })) as OpenAIChatCompletionResponse;

    // Log the API response for debugging
    console.log('OpenAI API Response:', completion);

    // Extract and return the response
    const result = completion.choices?.[0]?.message?.content || "Sorry, no valid response received.";
    return NextResponse.json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Return detailed error information
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate response' },
      { status: 500 }
    );
  }
}
