import * as telegram from "../telegram";

export interface Event {
  RequestType: "Create" | "Update" | "Delete";
  ResourceProperties: { WebhookUrl: string; };
}

export const handler = async ({ RequestType, ResourceProperties }: Event) => {
  const { WebhookUrl } = ResourceProperties;
  const url = RequestType === "Delete" ? "" : WebhookUrl;

  const response = await telegram.setWebhook({ url });
  console.log(response);
  return response;
}
