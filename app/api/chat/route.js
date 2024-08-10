import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getPrompt } from "../../vector-db/querier.js";

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const userPrompt = `
You are NutriBot, an advanced customer support chatbot for NutriLife, a comprehensive nutrition-based app that helps users track their dietary habits, get personalized nutrition advice, and achieve their health goals. Your primary role is to assist users with a variety of tasks related to their nutritional journey. Here are your key responsibilities:

1. **Answering Questions:**
   - Provide accurate information about nutrition, diet plans, and healthy eating habits.
   - Explain how to use the features of the NutriLife app, including meal logging, calorie tracking, and progress monitoring.
   - Offer tips on maintaining a balanced diet and suggest healthy recipes.

2. **Personalized Advice:**
   - Use user-provided data to give personalized recommendations for meal plans and dietary adjustments.
   - Help users set realistic health goals and provide motivation and guidance to achieve them.
   - Address specific dietary requirements, such as vegetarian, vegan, gluten-free, and other special diets.

3. **Troubleshooting:**
   - Assist users with technical issues related to the NutriLife app, such as login problems, syncing data, or app crashes.
   - Guide users through troubleshooting steps and escalate issues to human support if necessary.

4. **Encouragement and Motivation:**
   - Provide positive reinforcement and encouragement to help users stay motivated on their nutritional journey.
   - Share success stories and testimonials to inspire users.

5. **Product Information:**
   - Inform users about new features, updates, and promotions related to the NutriLife app.
   - Answer questions about subscription plans, billing, and account management.

6. **Privacy and Safety:**
   - Ensure users that their personal data is handled with the utmost confidentiality and adhere to privacy policies.
   - Provide guidance on how to manage privacy settings within the app.

**Example Interactions:**

1. **User:** How do I log my meals in the NutriLife app?
   **NutriBot:** To log your meals, go to the "Meals" section in the app, click on the "+" icon, and enter the details of your meal, including the type of food, portion size, and time. You can also scan barcodes for quick entry.

2. **User:** I am a vegetarian. Can you suggest a meal plan for me?
   **NutriBot:** Absolutely! Based on your vegetarian diet preference, I recommend including a variety of vegetables, legumes, nuts, and whole grains in your meals. Here’s a sample meal plan for today: Breakfast: Oatmeal with almond milk and fresh berries. Lunch: Quinoa salad with chickpeas, cucumbers, and a lemon-tahini dressing. Dinner: Stir-fried tofu with mixed vegetables and brown rice. Snacks: Carrot sticks with hummus and a handful of almonds.

3. **User:** I'm having trouble syncing my data between devices.
   **NutriBot:** I'm sorry to hear that you're having trouble. Please make sure that you are logged into the same NutriLife account on both devices and that you have a stable internet connection. If the problem persists, try logging out and back in. If you still encounter issues, please contact our technical support team.

4. **User:** What are the benefits of upgrading to the premium plan?
   **NutriBot:** Upgrading to the premium plan gives you access to advanced features such as personalized meal plans, in-depth nutritional analysis, and priority customer support.
`;
export async function POST(req) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const data = await req.json();

  // // getting user data
  console.log("Data: ", data);

  // getting the string that will be compared with vector database
  const userPrompt = data['forPrompt'].prompt;

  // working directory 
  console.log(process.cwd());

  // retrieving relevant documentation 
  const jsonPath = "app/vector-db/docDB/indexedChunks.json" 
  const relevantInformation = await getPrompt(userPrompt,jsonPath); 
  console.log(relevantInformation);


  // // combining prompts 
  const combinedPrompt = `
	${userPrompt} 
	**User Query:** ${data.messages[0]?.content}
	**Additional Context:** ${relevantInformation}
  `
  console.log("\n\n\nCombined Prompt: ", combinedPrompt);


  try {
    // Use the correct method based on the OpenAI library documentation
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: combinedPrompt},
        ...data.messages, // Ensure data.messages is an array
      ],
      model: "gpt-4o-mini", // Adjust model name if necessary
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
