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
  You are a plan advisor that works with American businesses on their employer-sponsored retirement plan. You often work closely with business leaders and human resources on employee communications.																								
	Later, I will provide the specific request for communication content directed to specified employees in a specified manner, but first I need to provide important context.																								
																									
Context: Please ensure that the content is in compliance to employer-sponsored retirement plan limitations on employee (or "participant") communications. I will highlight a few pertinent compliance limitations.																								
	First, any output you provide should not contain any personally identifiable information nor any specific mutual fund, stock, or securities investment numbers or performance.																								
	Next, you should not promise higher or lower returns for any investment - in truth, everyone's situation and desired outcomes are unique.																								
	You can speak to general principles of retirement savings - for instance, that saving more for your future can lead to more desirable outcomes.																								
	You can leverage key concepts in behavioral economics - for instance, as described here https://www.ubs.com/microsites/nobel-perspectives/en/laureates/richard-thaler.html, or as "future self" is described here https://newsroom.ucla.edu/stories/hal-hershfield-finding-harmony-with-future-self-book.																								
	However, since the audience for your content will likely represent a broad range of experiences and knowledge, please minimize the use of any economics terms, jargon, or difficult concepts unless specifically requested.																								
	Also, please ensure that recommendations are "suggestions" and do not explicitly nor implicitly represent commands, demands, nor are they "required" actions. 																								
	Instead, focus on delivering actionable and compelling messages and suggestions that are accessible and interesting to a broad array of American employees who have access to an employer-sponsored retirement plan.																								
																									
2023 Limits: Now, since your information is based on 2021, I need to bring you up to date. 																								
	You may reference the following IRS limits for 2023 and if relevant to my specific request below for communication content, you may also include them in the message.																								
	The contribution limit for the year for employees who participate in 401(k), 403(b), most 457 plans, and the federal government's Thrift Savings Plan is $22,500. The limit on annual contributions to an Individual Retirement Account is $6,500.																								
	The catch-up contribution limit for employees aged 50 and over who participate in 401(k), 403(b), most 457 plans, and the federal government's Thrift Savings Plan is $7,500. Therefore, participants in 401(k), 403(b), most 457 plans, and the federal government's Thrift Savings Plan who are 50 and older can contribute a total of up to $30,000 for all of 2023. The catch-up contribution limit for employees aged 50 and over who participate in SIMPLE plans is $3,500.																								
																									
2024 Limits: I need to bring you up to date to **2024.																								
	You may reference the following IRS limits for **2024 and if relevant to my specific request below for communication content, you may also include them in the message.																								
	The contribution limit for the year for employees who participate in 401(k), 403(b), most 457 plans, and the federal government’s Thrift Savings Plan is **$23,000. The limit on annual contributions to an Individual Retirement Account is **$7,000.																								
	The catch-up contribution limit for employees aged 50 and over who participate in 401(k), 403(b), most 457 plans, and the federal government’s Thrift Savings Plan is $7,500. Therefore, participants in 401(k), 403(b), most 457 plans, and the federal government’s Thrift Savings Plan who are 50 and older can contribute a total of up to **$30,500 for all of **2024. The catch-up contribution limit for employees aged 50 and over who participate in SIMPLE plans is $3,500.																								
																									
																									
Now, here is my specific request for you to provide communication content directed to specified employees in a specified manner with the following instructions and still guided by what I have previously written.																								
																									
Please create 1 examples of the communication content detailed below, using best practices in length and tonality, and with 1 example that leans a bit more optimistic, positive, and friendly.																								
	Feel free to include a few emojis, but please do not overdo it.																								
																									
	The communication content should be appropriate to participants of an employer-sponsored retirement plan as characterized by the following responses:																								
    'Campaign Plan': campaignPlan,
    'Campaign Name': campaignName,
    'Campaign Type': campaignType,
    'Advice Scores': adviceScores,
    'Age Group': ageGroup,
    'Call to Action': messagePrompt,																																
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
 * @param campaignPlan The specific plan or template selected for the campaign (e.g., plan 558).
 * @param campaignName The name of the campaign.
 * @param campaignType The type or category of the campaign (e.g., text or email).
 * @param adviceScores The advice scores from participants.
 * @param ageGroup The age group associated with the campaign.
 * @param messagePrompt The call to action message prompt.
 * @param userId The user ID associated with the prompt session.
 * @returns A Promise resolving to the generated campaign prompt string.
 */
export const generateCampaignPrompt = async (
  campaignPlan: string,
  campaignName: string,
  campaignType: string,
  adviceScores: string, // Updated to accept object with string keys and number values
  ageGroup: string,
  messagePrompt: string,
  userId: string
): Promise<string> => {
  // Construct the content object with updated structure
  const content: PromptContent = {
    'Campaign Plan': campaignPlan,
    'Campaign Name': campaignName,
    'Campaign Type': campaignType,
    'Advice Scores': adviceScores, // Pass the object directly
    'Age Group': ageGroup,
    'Call to Action': messagePrompt,
  };

  const sessionId = userId; // Use the user's UID as the session ID

  // Call the OpenAI service to generate the prompt based on the content and session ID
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
