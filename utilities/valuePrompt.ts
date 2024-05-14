import { openaiApiKey } from '@/constants/env';

/**
 * Generates a value proposition prompt based on provided client details.
 * @param idealClientDescription Description of the ideal client.
 * @param role The role description.
 * @param uniqueDescription Description of the unique selling point.
 * @param uid The user ID (optional).
 * @returns A Promise resolving to the generated value proposition prompt.
 */
export const generateValuePropPrompt = async (
  idealClientDescription: string,
  role: string,
  uniqueDescription: string,
  uid?: string
): Promise<string> => {
  const promptContent = `
    Introduction: You are a financial advisor focused on supporting employees of an employer-sponsored retirement plan.
    NarrativeTargeting: You would like to create a value proposition narrative targeted to a prospective client segment as described by:
    AgeRange: ${idealClientDescription}
    Context: Context for the prospect: ${role}
    UniqueDescription: How you, the advisor, are unique: ${uniqueDescription}
  `;

  const requestBody = {
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'system', content: promptContent }],
    max_tokens: 150,
    stop: ['Campaign Plan'],
    temperature: 0.5
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}` // Include your OpenAI API key in the request
    },
    body: JSON.stringify(requestBody)
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);

  if (!response.ok) {
    throw new Error(`Failed to generate value proposition: ${response.statusText}`);
  }

  const responseData = await response.json();
  const generatedPrompt = responseData.choices[0].message.content;

  return generatedPrompt;
};
