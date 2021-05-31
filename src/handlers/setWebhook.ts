import * as telegram from "../telegram";

export interface Event {
  RequestType: "Create" | "Update" | "Delete";
  ResourceProperties: {
    TelegramApiToken: string;
    WebhookUrl: string;
  };
}

export const handler = async ({ RequestType, ResourceProperties }: Event) => {
  const { TelegramApiToken, WebhookUrl } = ResourceProperties;
  const url = RequestType === "Delete" ? "" : WebhookUrl;

  const response = await telegram.post(TelegramApiToken)("setWebhook", { url });
  console.log(response);
  return response;
}
