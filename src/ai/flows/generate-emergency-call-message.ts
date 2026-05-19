'use server';
/**
 * @fileOverview Bu dosya, otomatik bir sesli arama için yapay zeka tarafından oluşturulan bir konuşma metni hazırlar.
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
  message: z.string().describe('Otomatik sesli arama sırasında asistanın okuyacağı konuşma metni.'),
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
  prompt: `Sen, otomatik bir TELEFON ARAMASI için profesyonel bir konuşma metni oluşturan bir sesli asistansın. 
Bu arama, kullanıcı {{{userName}}} sabah alarmına yanıt vermediği için yapılmaktadır.

Alıcı: {{{emergencyContactName}}}.
Olay: Kullanıcı sabah saat {{{timeMissed}}} civarındaki güvenli uyanış kontrolünü onaylamadı.

Metin şu kurallara uymalıdır:
1. "Merhaba {{{emergencyContactName}}}, ben VIGIL Akıllı Güvenlik Sistemi'nden otomatik bir sesli asistanım." cümlesiyle başla.
2. {{{userName}}} isimli kullanıcının belirlenen saatte uyanmadığını ve sisteme yanıt vermediğini belirt.
3. Çok nazik ama durumun ciddiyetini bildiren bir ton kullan.
4. Kullanıcıyı kontrol etmesi için alıcıyı uyar.
{{#if customMessage}}
5. Kullanıcının bıraktığı özel notu ekle: "{{{customMessage}}}"
{{/if}}
6. Metin kısa, anlaşılır ve bir telefon görüşmesine uygun olmalıdır.

Konuşma metnini tek bir paragraf olarak hazırla.`,
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
      throw new Error('Sesli arama metni oluşturulamadı.');
    }
    return output;
  }
);
