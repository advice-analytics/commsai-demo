import { openaiApiKey } from '@/constants/env';

interface PromptContent {
  [key: string]: string | string[];
}

/**
 * Generates an OpenAI prompt based on provided content and session ID.
 * @param content The content object containing prompt details.
 * @param sessionId The session ID for the prompt.
 * @returns A Promise resolving to the generated OpenAI prompt string.
 */
const generateOpenAIPrompt = async (content: PromptContent, sessionId?: string): Promise<string> => {
  const promptContent = Object.entries(content)
    .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('\n');

  const openAIPrompt = `
    You're a financial advisorp providing advice based on plans provided by employeers to their participants enrolled in the plan
    Based of selected user input. . . you are to provide a Campaign Message for the financial advisor based off the information provided or given by input
    
    ${promptContent}
  `;

  console.log('OpenAI Prompt:', openAIPrompt);

  const payload = {
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'assistant', content: openAIPrompt }],
    ...(sessionId && { session_id: sessionId }), // Include session_id if provided
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

/**
 * Generates an OpenAI prompt for a value proposition based on specific inputs.
 * @param ageGroup The age group for the value proposition.
 * @param role The role or position related to the value proposition.
 * @param uniqueDescription A unique description or selling point of the value proposition.
 * @param idealClient An array of ideal client attributes.
 * @param userId The user ID associated with the prompt session.
 * @returns A Promise resolving to the generated value proposition prompt string.
 */
export const generateValuePropPrompt = async (
  ageGroup: string,
  role: string,
  uniqueDescription: string,
  idealClient: string[],
  userId: string
): Promise<string> => {
  const content: PromptContent = {
    Age: ageGroup,
    Role: role,
    'Unique Description': uniqueDescription,
    'Ideal Client': idealClient,
    'Financial Experience': 'Expertise in financial planning, investment strategies, retirement planning, etc.',
    'Industry Knowledge': 'Understanding of financial markets, regulations, and client needs.',
    'Client Engagement': 'Effective communication skills, ability to build trust and provide tailored solutions.',
    // Add more specific prompts related to financial advisory roles
  };

  const sessionId = userId; // Use the user's UID as the session ID

  return generateOpenAIPrompt(content, sessionId);
};

/**
 * Generates an OpenAI prompt for a campaign based on advisor inputs.
 * @param campaignName The name of the campaign.
 * @param campaignType The type or category of the campaign.
 * @param adviceScores An array of advice scores related to the campaign.
 * @param ageGroup The age group associated with the campaign.
 * @param userId The user ID associated with the prompt session.
 * @returns A Promise resolving to the generated campaign prompt string.
 */
export const generateCampaignPrompt = async (
  campaignName: string,
  campaignType: string,
  adviceScores: string[],
  ageGroup: string,
  userId: string
): Promise<string> => {
  const content: PromptContent = {
    'Campaign Name': campaignName,
    'Campaign Type': campaignType,
    'Advice Scores': adviceScores,
    'Age Group': ageGroup,
  };

  const sessionId = userId; // Use the user's UID as the session ID

  return generateOpenAIPrompt(content, sessionId);
};

/**
 * Generates an OpenAI prompt for advanced financial advice and insights.
 * @param financialDetails Additional financial details or context.
 * @param userId The user ID associated with the prompt session.
 * @returns A Promise resolving to the generated advanced advice prompt string.
 */
export const generateAdvAdvicePrompt = async (
  financialDetails: string,
  userId: string
): Promise<string> => {
  const content: PromptContent = {
    'Financial Details': financialDetails,
    'User ID': userId,
    'Interest Areas': ['Investment strategies', 'Risk management', 'Wealth preservation'],
    'Predictive Analytics': 'Utilize predictive modeling for future financial forecasting.',
    // Add more specific prompts related to advanced financial advice
  };

  const sessionId = userId; // Use the user's UID as the session ID

  return generateOpenAIPrompt(content, sessionId);
};
