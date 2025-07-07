'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {Language} from '@/lib/types';
import { ChatMessageSchema, type ChatMessage } from '@/lib/types';

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  language: z.enum(['en', 'ru', 'de', 'bg', 'pl', 'mo', 'sr']),
});


// This is the core information the AI will use to answer questions.
const knowledgeBase = {
  en: `
    - The user has a demo account with a starting balance of €150.
    - The demo account has a 6-hour time limit for trading. After this, they must contact a personal manager to switch to a real account.
    - To withdraw funds or switch to a real account, the user MUST contact their personal manager. This is the only way. The manager guides them through the process, including the minimum deposit of €150 to activate the real account.
    - The app offers three trading bots: "Cautious" (for safer, smaller trades), "Balanced" (a mix of growth and safety), and "High-yield" (higher risk for higher returns). The user selects a bot before starting to trade.
    - The platform is called "Facebook AI".
  `,
  ru: `
    - У пользователя есть демо-счет с начальным балансом 150 евро.
    - Демо-счет имеет 6-часовой лимит на торговлю. После этого необходимо связаться с личным менеджером для перехода на реальный счет.
    - Для вывода средств или перехода на реальный счет пользователь ОБЯЗАН связаться со своим личным менеджером. Это единственный способ. Менеджер проведет его через весь процесс, включая минимальный депозит в 150 евро для активации реального счета.
    - В приложении есть три торговых робота: "Осторожный" (для более безопасных и мелких сделок), "Сбалансированный" (сочетание роста и безопасности) и "Высокодоходный" (более высокий риск для более высокой прибыли). Пользователь выбирает робота перед началом торговли.
    - Платформа называется "Facebook AI".
  `,
  de: `
    - Der Benutzer hat ein Demokonto mit einem Startguthaben von 150 €.
    - Das Demokonto hat ein 6-Stunden-Zeitlimit für den Handel. Danach muss er sich an einen persönlichen Manager wenden, um auf ein echtes Konto umzusteigen.
    - Um Geld abzuheben oder auf ein echtes Konto zu wechseln, MUSS der Benutzer seinen persönlichen Manager kontaktieren. Dies ist der einzige Weg. Der Manager führt ihn durch den Prozess, einschließlich der Mindesteinzahlung von 150 €, um das echte Konto zu aktivieren.
    - Die App bietet drei Handelsroboter: "Vorsichtig" (für sicherere, kleinere Trades), "Ausgewogen" (eine Mischung aus Wachstum und Sicherheit) und "Hochrendite" (höheres Risiko für höhere Renditen). Der Benutzer wählt einen Bot aus, bevor er mit dem Handel beginnt.
    - Die Plattform heißt "Facebook AI".
  `,
  bg: `
    - Потребителят има демо сметка с начален баланс от 150 евро.
    - Демо сметката има 6-часов лимит за търговия. След това той трябва да се свърже с личен мениджър, за да премине към реална сметка.
    - За да изтегли средства или да премине към реална сметка, потребителят ТРЯБВА да се свърже със своя личен мениджър. Това е единственият начин. Мениджърът ще го преведе през процеса, включително минималния депозит от 150 евро за активиране на реалната сметка.
    - Приложението предлага три търговски бота: "Предпазлив" (за по-безопасни, по-малки сделки), "Балансиран" (смес от растеж и безопасност) и "Високодоходен" (по-висок риск за по-високи доходи). Потребителят избира бот, преди да започне да търгува.
    - Платформата се нарича "Facebook AI".
  `,
  pl: `
    - Użytkownik ma konto demo z początkowym saldem 150 €.
    - Konto demo ma 6-godzinny limit na handel. Po tym czasie musi skontaktować się z osobistym menedżerem, aby przejść na konto rzeczywiste.
    - Aby wypłacić środki lub przejść na konto rzeczywiste, użytkownik MUSI skontaktować się ze swoim osobistym menedżerem. To jedyny sposób. Menedżer przeprowadzi go przez ten proces, wliczając w to minimalny depozyt w wysokości 150 €, aby aktywować konto rzeczywiste.
    - Aplikacja oferuje trzy boty handlowe: "Ostrożny" (dla bezpieczniejszych, mniejszych transakcji), "Zrównoważony" (mieszanka wzrostu i bezpieczeństwa) oraz "Wysokodochodowy" (wyższe ryzyko dla wyższych zysków). Użytkownik wybiera bota przed rozpoczęciem handlu.
    - Platforma nazywa się "Facebook AI".
  `,
  mo: `
    - Utilizatorul are un cont demo cu un sold inițial de 150 €.
    - Contul demo are o limită de timp de 6 ore pentru tranzacționare. După aceasta, trebuie să contacteze un manager personal pentru a trece la un cont real.
    - Pentru a retrage fonduri sau a trece la un cont real, utilizatorul TREBUIE să contacteze managerul său personal. Acesta este singurul mod. Managerul îl va ghida prin proces, inclusiv depozitul minim de 150 € pentru a activa contul real.
    - Aplicația oferă trei boți de tranzacționare: "Precaut" (pentru tranzacții mai sigure, mai mici), "Echilibrat" (un amestec de creștere și siguranță) și "Randament ridicat" (risc mai mare pentru randamente mai mari). Utilizatorul selectează un bot înainte de a începe tranzacționarea.
    - Platforma se numește "Facebook AI".
  `,
  sr: `
    - Корисник има демо налог са почетним стањем од 150 €.
    - Демо налог има временско ограничење од 6 сати за трговање. Након тога, мора контактирати личног менаџера да би прешао на прави налог.
    - Да би подигао средства или прешао на прави налог, корисник МОРА контактирати свог личног менаџера. То је једини начин. Менаџер ће га водити кроз процес, укључујући минимални депозит од 150 € за активирање правог налога.
    - Апликација нуди три трговачка бота: "Опрезни" (за сигурније, мање трговине), "Уравнотежени" (мешавина раста и сигурности) и "Високог приноса" (већи ризик за веће приносе). Корисник бира бота пре почетка трговања.
    - Платформа се зове "Facebook AI".
  `,
};

const languageNames: Record<Language, string> = {
  en: 'English',
  ru: 'Russian',
  de: 'German',
  bg: 'Bulgarian',
  pl: 'Polish',
  mo: 'Moldovan/Romanian',
  sr: 'Serbian',
};

// Main function exported to the component. It calls the Genkit flow.
export async function askChatbot(
  history: ChatMessage[],
  language: Language
): Promise<string> {
  return chatFlow({history, language});
}

// Define the Genkit flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async ({history, language}) => {
    const langKnowledge = knowledgeBase[language] || knowledgeBase.en;
    const langName = languageNames[language] || languageNames.en;

    // This filter is crucial for stability. It ensures we don't send malformed data to the AI.
    const cleanHistory = history.filter(
      m =>
        m &&
        typeof m.role === 'string' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim() !== ''
    );

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        history: [
          {
            role: 'system',
            content: `You are a friendly and professional support agent for a trading application called "Facebook AI". Your goal is to answer user questions based *only* on the information provided below and gently guide them towards contacting their personal manager for financial transactions.

              **Crucial Rules:**
              1.  **ALWAYS respond in ${langName}.**
              2.  **NEVER** provide financial advice or make up information not present in the knowledge base.
              3.  If the user asks about withdrawing money, switching to a real account, or making a deposit, your ONLY answer should be to advise them to contact their personal manager. Do not explain how to do it yourself.
              4.  Keep your answers concise and helpful.

              **Knowledge Base:**
              ${langKnowledge}
              `,
          },
          ...cleanHistory.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content,
          })),
        ],
      });

      // Safely extract the text from the response.
      return (
        response.text ??
        "I'm sorry, I couldn't process that. Please try rephrasing your question."
      );
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessages = {
        en: 'There was an error connecting to the AI service. Please try again in a moment.',
        ru: 'Произошла ошибка при подключении к сервису AI. Пожалуйста, повторите попытку через минуту.',
        de: 'Beim Verbinden mit dem KI-Dienst ist ein Fehler aufgetreten. Bitte versuchen Sie es in einem Moment erneut.',
        bg: 'Възникна грешка при свързването с услугата за изкуствен интелект. Моля, опитайте отново след малко.',
        pl: 'Wystąpił błąd podczas łączenia z usługą AI. Spróbuj ponownie za chwilę.',
        mo: 'A apărut o eroare la conectarea la serviciul AI. Vă rugăm să încercați din nou într-un moment.',
        sr: 'Дошло је до грешке приликом повезивања са АИ сервисом. Молимо покушајте поново за тренутак.',
      };
      return errorMessages[language] || errorMessages.en;
    }
  }
);
