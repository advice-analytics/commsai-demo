import { openaiApiKey } from '@/constants/env';

interface PromptContent {
  [key: string]: string | string[];
}

const generateOpenAIPrompt = async (content: PromptContent, sessionId?: string): Promise<string> => {
  const promptContent = Object.entries(content)
    .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('\n');

  const openAIPrompt = `
    Assistant prompt:
    
    ${promptContent}
  `;

  console.log('OpenAI Prompt:', openAIPrompt);

  const payload = {
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'assistant', content: openAIPrompt }],
    // Use session_id only if provided; omit if sessionId is undefined or empty
    ...(sessionId && { session_id: sessionId }),
  };

  console.log('OpenAI Payload:', payload);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('OpenAI API Response:', response);

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const responseData = await response.json();
    const generatedPrompt = responseData?.choices?.[0]?.message?.content || '';

    console.log('Generated Prompt:', generatedPrompt);

    return generatedPrompt;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

// Generate OpenAI prompt for value proposition based on inputs
export const generateValuePropPrompt = async (
  ageGroup: string,
  role: string,
  uniqueDescription: string,
  idealClient: string[],
  userId: string // Pass the user's UID
): Promise<string> => {
  const content: PromptContent = {
    Age: ageGroup,
    Role: role,
    'Unique Description': uniqueDescription,
    'Ideal Client': idealClient,
  };

  const sessionId = userId; // Use the user's UID as the session ID

  return generateOpenAIPrompt(content, sessionId);
};

// Generate OpenAI prompt for campaign based on advisor inputs
export const generateCampaignPrompt = async (
  campaignName: string,
  campaignType: string,
  adviceScores: string[],
  ageGroup: string,
  incomeFrom: number,
  incomeTo: number,
  balanceFrom: number,
  balanceTo: number,
  userId: string // Pass the user's UID
): Promise<string> => {
  const content: PromptContent = {
    'Campaign Name': campaignName,
    'Campaign Type': campaignType,
    'Advice Scores': adviceScores,
    'Age Group': ageGroup,
    'Income': `From ${incomeFrom} To ${incomeTo}`,
    'Balance': `From ${balanceFrom} To ${balanceTo}`,
  };

  const sessionId = userId; // Use the user's UID as the session ID

  return generateOpenAIPrompt(content, sessionId);
};
