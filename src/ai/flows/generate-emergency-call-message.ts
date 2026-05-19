'use server';
/**
 * @fileOverview Bu dosya, kişiselleştirilmiş bir acil durum çağrı mesajı oluşturmak için bir Genkit akışı uygular.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmergencyCallMessageInputSchema = z.object({
  userName: z.string().describe('Alarmı kaçıran kullanıcının adı.'),
  emergencyContactName: z.string().describe('Aranacak acil durum kişisinin adı.'),
  timeMissed: z.string().describe('Alarmın kaçırıldığı yaklaşık zaman (örn. "07:05").'),
  customMessage:
    z.string().optional().describe('Kullanıcının uyarıya eklemek istediği isteğe bağlı özel mesaj.'),
});
export type GenerateEmergencyCallMessageInput = z.infer<
  typeof GenerateEmergencyCallMessageInputSchema
>;

const GenerateEmergencyCallMessageOutputSchema = z.object({
  message: z.string().describe('Otomatik acil durum araması için oluşturulan konuşma metni.'),
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
  prompt: `Sen, otomatik bir telefon araması için net ve kısa bir mesaj oluşturmakla görevli bir yapay zeka asistanısın. Bu arama, kullanıcı {{{userName}}} alarmını kaçırdığı için acil durum kişisine yapılmaktadır.

Alıcı: {{{emergencyContactName}}}.
Alarmın kaçırılma saati: yaklaşık {{{timeMissed}}}.

Eğer kullanıcı özel bir mesaj bıraktıysa, bunu yardımcı bir şekilde ekle:
{{#if customMessage}}
{{{userName}}} tarafından bırakılan not: "{{{customMessage}}}"
{{/if}}

Lütfen {{{emergencyContactName}}} için kısa, nazik ve bilgilendirici bir konuşma metni oluştur. {{{userName}}} isimli kişinin alarmını kaçırdığını ve kendisine ulaşamadığımızı, bu aramanın VefaAlarm sisteminden gelen otomatik bir uyarı olduğunu belirt. Onu kontrol etmesini tavsiye et.

Mesaj tek bir paragraf olmalı ve "Merhaba {{emergencyContactName}}, " ile başlamalıdır.`,
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
      throw new Error('Acil durum mesajı oluşturulamadı.');
    }
    return output;
  }
);
