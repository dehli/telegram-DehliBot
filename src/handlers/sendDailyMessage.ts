import * as env from "../env";
import * as telegram from "../telegram";
import * as twitter from "../twitter";

const { TWITTER_USER_TO_CHECK } = process.env;

export const handler = async (_event: any) => {
  if (TWITTER_USER_TO_CHECK) {
    const available = await twitter.usernameAvailable(
      TWITTER_USER_TO_CHECK
    );

    await telegram.sendMessage({
      chat_id: env.telegramChatId,
      text: `${TWITTER_USER_TO_CHECK} available: ${available}`,
    });
  }
};
