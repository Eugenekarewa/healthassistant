import { useState } from 'react';

// Define the OpenAIResponse interface
interface OpenAIResponse<T> {
  result: T;
}

export function useOpenAI<T>() {
  const [result, setResult] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate response');
      }

      const data: OpenAIResponse<T> = await response.json();
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating the response');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, generateResponse };
}
