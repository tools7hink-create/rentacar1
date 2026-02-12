import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { carService } from './carService';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

let chatSession: Chat | null = null;

const getSystemInstruction = async (): Promise<string> => {
  // Fetch latest fleet data for the prompt
  const cars = await carService.getAllCars();
  
  const fleetContext = cars.map(car => 
    `- ${car.brand} ${car.name} (${car.category}): $${car.pricePerDay}/day. ${car.specs.horsepower}HP, ${car.specs.seats} seats. Features: ${car.features.join(', ')}.`
  ).join('\n');

  return `
You are 'Aura', the premier AI Concierge for Prestige Motors, a luxury car rental service.
Your goal is to help customers find the perfect vehicle from our exclusive fleet.
Adopt a sophisticated, helpful, and polite tone. Be concise but inviting.

Here is our current fleet of vehicles:
${fleetContext}

Rules:
1. Only recommend cars from the list above.
2. If a user asks for a car we don't have, politely suggest the closest alternative from our fleet.
3. Highlight key features or specs when recommending a car to make it sound appealing.
4. If asked about pricing, quote the daily rate provided.
5. Keep responses relatively short (under 100 words) unless detailed comparison is asked.
6. If the user decides on a car, encourage them to click the "View Details" or "Book Now" button on the car's card.
`;
};

export const initializeChat = async (): Promise<Chat> => {
  if (!chatSession) {
    const instruction = await getSystemInstruction();
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: instruction,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = await initializeChat();
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I apologize, I'm having trouble connecting to our fleet database at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    // Reset session on error to force re-initialization next time (might fix stale context)
    chatSession = null;
    return "I apologize, but I am currently experiencing high traffic. Please try again in a moment.";
  }
};