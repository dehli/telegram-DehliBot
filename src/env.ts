const { TELEGRAM_API_TOKEN, TELEGRAM_CHAT_ID } = process.env;
if (!TELEGRAM_API_TOKEN || !TELEGRAM_CHAT_ID) {
  throw new Error("Missing environment variable");
}

export const telegramApiToken = TELEGRAM_API_TOKEN;
export const telegramChatId = TELEGRAM_CHAT_ID;
