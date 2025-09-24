'use server';

import { headers } from 'next/headers';
import { sendTelegramNotification } from '@/services/telegram-service';

interface ClientInfo {
  platform: string;
  language: string;
}

export async function notifySessionStart(clientInfo: ClientInfo): Promise<void> {
  const h = headers();
  const ip = h.get('x-forwarded-for') ?? 'N/A';
  const userAgent = h.get('user-agent') ?? 'N/A';
  const referer = h.get('referer') ?? 'N/A';

  const message = `
DEMO
🚀 <b>New Session Started</b> 🚀

<b>Client Details</b>
• <b>IP Address:</b> ${ip}
• <b>Platform:</b> ${clientInfo.platform}
• <b>Language:</b> ${clientInfo.language}
• <b>Referer:</b> ${referer}

<b>User Agent</b>
<pre><code>${userAgent}</code></pre>
  `.trim();

  try {
    await sendTelegramNotification(message);
  } catch (error) {
    console.error("Failed to trigger Telegram notification:", error);
  }
}
