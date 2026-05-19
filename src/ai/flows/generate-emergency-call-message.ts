'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating a personalized emergency call message.
 *
 * - generateEmergencyCallMessage - A function that generates a customized script for an automated emergency call.
 * - GenerateEmergencyCallMessageInput - The input type for the generateEmergencyCallMessage function.
 * - GenerateEmergencyCallMessageOutput - The return type for the generateEmergencyCallMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmergencyCallMessageInputSchema = z.object({
  userName: z.string().describe('The name of the user who missed their alarm.'),
  emergencyContactName: z.string().describe('The name of the emergency contact to be called.'),
  timeMissed: z.string().describe('The approximate time the alarm was missed (e.g., "7:05 AM").'),
  customMessage:
    z.string().optional().describe('An optional custom message from the user to include in the alert.'),
});
export type GenerateEmergencyCallMessageInput = z.infer<
  typeof GenerateEmergencyCallMessageInputSchema
>;

const GenerateEmergencyCallMessageOutputSchema = z.object({
  message: z.string().describe('The generated speech script for the automated emergency call.'),
});
export type GenerateEmergencyCallMessageOutput = z.infer<
  typeof GenerateEmergencyCallMessageOutputSchema
>;

export async function generateEmergencyCallMessage(
  input: GenerateEmergencyCallMessageInput
): Promise<GenerateEmergencyCallMessageOutput> {
  return generateEmergencyCallMessageFlow(input);
}

const generateEmergencyCallMessagePrompt = ai.definePrompt({
  name: 'generateEmergencyCallMessagePrompt',
  input: {schema: GenerateEmergencyCallMessageInputSchema},
  output: {schema: GenerateEmergencyCallMessageOutputSchema},
  prompt: `You are an AI assistant tasked with generating a clear and concise message for an automated phone call to an emergency contact. The call is being made because the user, {{{userName}}}, has missed their alarm.

The recipient of this call is {{{emergencyContactName}}}.

The alarm was missed at approximately {{{timeMissed}}}.

If the user provided a custom message, include it in a helpful way:
{{#if customMessage}}
Custom message from {{{userName}}}: "{{{customMessage}}}"
{{/if}}

Please generate a short, polite, and informative speech script for {{{emergencyContactName}}} to let them know that {{{userName}}} missed their alarm and that this is an automated alert from GuardianWake. Advise them to try and contact {{{userName}}}.

The message should be in a single paragraph, starting with "Hello {{emergencyContactName}}, ".`,
});

const generateEmergencyCallMessageFlow = ai.defineFlow(
  {
    name: 'generateEmergencyCallMessageFlow',
    inputSchema: GenerateEmergencyCallMessageInputSchema,
    outputSchema: GenerateEmergencyCallMessageOutputSchema,
  },
  async input => {
    const {output} = await generateEmergencyCallMessagePrompt(input);
    if (!output) {
      throw new Error('Failed to generate emergency call message.');
    }
    return output;
  }
);
