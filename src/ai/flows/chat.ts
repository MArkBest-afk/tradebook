'use server';

import { Language } from '@/lib/types';

// The chat history format expected by the component
export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

// Simplified translations for the chat flow
const responses: Record<Language, Record<string, string>> = {
    en: {
        greeting: "Hello! How can I help you today?",
        fallback: "I can answer questions about the Facebook AI trading app. For example, you can ask about the demo account, trading bots, or how to withdraw funds.",
        withdraw: "To withdraw funds or switch to a real account, you must contact your personal manager. They will guide you through the process.",
        bots: "The app has three trading bots: Cautious (for safer, smaller trades), Balanced (a mix of growth and safety), and High-yield (higher risk for higher returns). You can select one before you start trading.",
        limit: "Your demo account has a 6-hour time limit for trading. After this time, you will need to contact your personal manager to switch to a real account."
    },
    ru: {
        greeting: "Здравствуйте! Чем я могу вам помочь сегодня?",
        fallback: "Я могу ответить на вопросы о торговом приложении Facebook AI. Например, вы можете спросить о демо-счете, торговых ботах или о том, как вывести средства.",
        withdraw: "Для вывода средств или перехода на реальный счет необходимо связаться с вашим личным менеджером. Он поможет вам пройти этот процесс.",
        bots: "В приложении есть три торговых бота: Осторожный (для более безопасных и мелких сделок), Сбалансированный (сочетание роста и безопасности) и Высокодоходный (более высокий риск для более высокой прибыли). Вы можете выбрать одного из них перед началом торговли.",
        limit: "Ваш демо-счет имеет 6-часовой лимит на торговлю. По истечении этого времени вам нужно будет связаться с вашим личным менеджером, чтобы перейти на реальный счет."
    },
    de: {
        greeting: "Hallo! Wie kann ich Ihnen heute helfen?",
        fallback: "Ich kann Fragen zur Facebook AI-Handels-App beantworten. Sie können zum Beispiel nach dem Demokonto, den Handelsrobotern oder der Auszahlung von Geldern fragen.",
        withdraw: "Um Geld abzuheben oder zu einem echten Konto zu wechseln, müssen Sie sich an Ihren persönlichen Manager wenden. Er wird Sie durch den Prozess führen.",
        bots: "Die App verfügt über drei Handelsroboter: Vorsichtig (für sicherere, kleinere Trades), Ausgewogen (eine Mischung aus Wachstum und Sicherheit) und Hochrendite (höheres Risiko für höhere Renditen). Sie können einen auswählen, bevor Sie mit dem Handel beginnen.",
        limit: "Ihr Demokonto hat ein 6-Stunden-Zeitlimit für den Handel. Nach dieser Zeit müssen Sie sich an Ihren persönlichen Manager wenden, um zu einem echten Konto zu wechseln."
    },
    bg: {
        greeting: "Здравейте! С какво мога да ви помогна днес?",
        fallback: "Мога да отговарям на въпроси относно приложението за търговия на Facebook AI. Например, можете да попитате за демо сметката, търговските ботове или как да изтеглите средства.",
        withdraw: "За да изтеглите средства или да преминете към реален акаунт, трябва да се свържете с личния си мениджър. Той ще ви преведе през процеса.",
        bots: "Приложението има три търговски бота: Предпазлив (за по-безопасни, по-малки сделки), Балансиран (смес от растеж и безопасност) и Високодоходен (по-висок риск за по-високи доходи). Можете да изберете един, преди да започнете да търгувате.",
        limit: "Вашата демо сметка има 6-часов лимит за търговия. След това време ще трябва да се свържете с личния си мениджър, за да преминете към реален акаунт."
    },
    pl: {
        greeting: "Witaj! Jak mogę Ci dzisiaj pomóc?",
        fallback: "Mogę odpowiedzieć na pytania dotyczące aplikacji handlowej Facebook AI. Możesz na przykład zapytać o konto demo, boty handlowe lub jak wypłacić środki.",
        withdraw: "Aby wypłacić środki lub przejść na konto rzeczywiste, musisz skontaktować się ze swoim osobistym menedżerem. Poprowadzi Cię on przez ten proces.",
        bots: "Aplikacja ma trzy boty handlowe: Ostrożny (dla bezpieczniejszych, mniejszych transakcji), Zrównoważony (połączenie wzrostu i bezpieczeństwa) oraz Wysokodochodowy (większe ryzyko dla większych zysków). Możesz wybrać jednego przed rozpoczęciem handlu.",
        limit: "Twoje konto demo ma 6-godzinny limit na handel. Po tym czasie będziesz musiał skontaktować się ze swoim osobistym menedżerem, aby przejść na konto rzeczywiste."
    },
    mo: {
        greeting: "Bună! Cu ce te pot ajuta astăzi?",
        fallback: "Pot răspunde la întrebări despre aplicația de tranzacționare Facebook AI. De exemplu, puteți întreba despre contul demo, boții de tranzacționare sau cum să retrageți fonduri.",
        withdraw: "Pentru a retrage fonduri sau a trece la un cont real, trebuie să contactați managerul personal. Acesta vă va ghida prin proces.",
        bots: "Aplicația are trei boți de tranzacționare: Precaut (pentru tranzacții mai sigure, mai mici), Echilibrat (un amestec de creștere și siguranță) și cu Randament Ridicat (risc mai mare pentru randamente mai mari). Puteți selecta unul înainte de a începe tranzacționarea.",
        limit: "Contul dvs. demo are o limită de timp de 6 ore pentru tranzacționare. După acest timp, va trebui să contactați managerul personal pentru a trece la un cont real."
    },
    sr: {
        greeting: "Zdravo! Kako vam danas mogu pomoći?",
        fallback: "Mogu da odgovaram na pitanja o aplikaciji za trgovanje Facebook AI. Na primer, možete pitati o demo nalogu, trgovačkim botovima ili kako da podignete sredstva.",
        withdraw: "Da biste podigli sredstva ili prešli na pravi nalog, morate kontaktirati svog ličnog menadžera. On će vas voditi kroz proces.",
        bots: "Aplikacija ima tri trgovačka bota: Oprezni (za sigurnije, manje trgovine), Uravnoteženi (mešavina rasta i sigurnosti) i Visokog prinosa (veći rizik za veće prinose). Možete izabrati jednog pre nego što počnete da trgujete.",
        limit: "Vaš demo nalog ima vremensko ograničenje od 6 sati za trgovanje. Nakon tog vremena, moraćete da kontaktirate svog ličnog menadžera da biste prešli na pravi nalog."
    }
};


export async function askChatbot(history: ChatMessage[], language: Language): Promise<string> {
    const userMessages = history.filter(m => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

    const langResponses = responses[language] || responses.en;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    if (lastUserMessage.includes('withdraw') || lastUserMessage.includes('money') || lastUserMessage.includes('real') || lastUserMessage.includes('deposit') || lastUserMessage.includes('вывод') || lastUserMessage.includes('деньги') || lastUserMessage.includes('реальный') || lastUserMessage.includes('депозит') || lastUserMessage.includes('пополнить') || lastUserMessage.includes('счет')) {
        return langResponses.withdraw;
    }
    
    if (lastUserMessage.includes('bot') || lastUserMessage.includes('bots') || lastUserMessage.includes('robot') || lastUserMessage.includes('бот') || lastUserMessage.includes('робот')) {
        return langResponses.bots;
    }

    if (lastUserMessage.includes('time') || lastUserMessage.includes('limit') || lastUserMessage.includes('demo') || lastUserMessage.includes('время') || lastUserMessage.includes('лимит') || lastUserMessage.includes('демо')) {
        return langResponses.limit;
    }

    return langResponses.fallback;
}
