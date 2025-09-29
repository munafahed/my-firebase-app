"use server";

import {
  generateDailyCard,
  type GenerateDailyCardInput,
} from "@/ai/flows/generate-daily-card";
import { type DailyCard } from "@/lib/types";

export async function generateDailyCardAction(input: GenerateDailyCardInput): Promise<{ success: true; data: DailyCard } | { success: false; error: string }> {
  try {
    const card = await generateDailyCard(input);
    return { success: true, data: card };
  } catch (error) {
    console.error("Error generating daily card:", error);
    // In a real app, you might want to log this error to a monitoring service
    return { success: false, error: "Failed to generate a new card from our AI. Please try again later." };
  }
}
