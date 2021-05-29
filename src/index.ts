import * as telegram from "./telegram";
import * as twitter from "./twitter";

(async () => {
  await telegram.post("setMyCommands", {
    commands: [
      { command: "echo", description: "Send request back." },
      { command: "twitter", description: "Check whether twitter handle is taken." }
    ]
  });
})();

export interface TelegramBody {
  message: {
    chat: { id: number; };
    text: string;
  }
}

export const handler = async (event: any) => {
  const body = JSON.parse(event.body) as TelegramBody;
  const { chat, text } = body.message;

  if (text.startsWith("/echo")) {
    const message = JSON.stringify(body, null, 2);

    await telegram.post("sendMessage", {
      chat_id: chat.id,
      entities: [
        { offset: 0, length: message.length, type: "code" }
      ],
      text: message
    });
  }

  const twitterMatch = text.match(/^\/twitter (.+)/);
  if (twitterMatch) {
    const username = twitterMatch[1];
    const available = await twitter.usernameAvailable(username);

    await telegram.post("sendMessage", {
      chat_id: chat.id,
      text: `${username} available: ${available}`
    });
  }

  return { statusCode: 200 };
}
