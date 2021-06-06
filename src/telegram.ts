import bent from "bent";
import * as env from "./env";

const post = (apiToken: string) => bent(
  `https://api.telegram.org/bot${apiToken}/`,
  "POST",
  "json",
  200
);

export const sendMessage = (props: any) =>
  post(env.telegramApiToken)("sendMessage", props);
export const setMyCommands = (props: any) =>
  post(env.telegramApiToken)("setMyCommands", props);
export const setWebhook = (props: any) =>
  post(env.telegramApiToken)("setWebhook", props);
