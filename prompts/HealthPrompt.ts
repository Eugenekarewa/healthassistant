export const HealthPrompt = {
  model: "gpt-4o-mini-2024-07-18",
  temperature: 1,
  systemPrompt: "You are a compassionate assistant providing mental health support.",
  userPrompt: (query: string) => `Provide advice or support for: ${query}.`,
  responseFormat: {
    type: "json_schema",
    json_schema: {
      name: "mentalHealthResponse",
      strict: true,
      schema: {
        type: "object",
        properties: {
          advice: {
            type: "string",
            description: "The advice or response for the mental health query.",
          },
        },
        required: ["advice"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
    },
  },
};
