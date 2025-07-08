// A service to send notifications to a Telegram bot.
'use server';

const TELEGRAM_BOT_TOKEN = '8094409679:AAHkOPDEjaogohc4qeugne5UCm8AaZXU8Qk';
const CHAT_IDS = ['7798417645', '7829401426'];

export async function sendTelegramNotification(message: string): Promise<void> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  for (const chatId of CHAT_IDS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      const result = await response.json();
      if (!result.ok) {
        console.error(`Failed to send message to chat_id ${chatId}:`, result.description);
      }
    } catch (error) {
      console.error(`Error sending Telegram notification to chat_id ${chatId}:`, error);
    }
  }
}
