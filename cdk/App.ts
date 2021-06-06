import * as cdk from "monocdk";
import * as path from "path";

const {
  TELEGRAM_API_TOKEN,
  TELEGRAM_CHAT_ID = "",
} = process.env;

if (!TELEGRAM_API_TOKEN) {
  throw new Error("Missing TELEGRAM_API_TOKEN");
}

const app = new cdk.App();
const stack = new cdk.Stack(app, "Telegram-DehliBot");

const codeFromPath = (relativePath: string) =>
  cdk.aws_lambda.Code.fromAsset(path.resolve(__dirname, "../../", relativePath));

const functionHandler = (file: string) => `handlers/${file}.handler`;
const functionProps = {
  code: codeFromPath("./out/src"),
  environment: {
    TELEGRAM_API_TOKEN,
    TELEGRAM_CHAT_ID,
  },
  layers: [
    new cdk.aws_lambda.LayerVersion(stack, "Layer", {
      code: codeFromPath("./layer"),
    }),
  ],
  logRetention: cdk.aws_logs.RetentionDays.ONE_DAY,
  memorySize: 2048,
  runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
  timeout: cdk.Duration.seconds(29),
};

const webhookPath = TELEGRAM_API_TOKEN.replace(":", "/");
const webhookIntegration = new cdk.aws_apigatewayv2_integrations.LambdaProxyIntegration({
  handler: new cdk.aws_lambda.Function(stack, "TelegramFunction", {
    ...functionProps,
    handler: functionHandler("webhook"),
  }),
});

const api = new cdk.aws_apigatewayv2.HttpApi(stack, "DehliBotApi");
api.addRoutes({
  path: "/" + webhookPath,
  methods: [cdk.aws_apigatewayv2.HttpMethod.POST],
  integration: webhookIntegration,
});

const setWebhookProvider = new cdk.custom_resources.Provider(stack, "SetWebhookProvider", {
  onEventHandler: new cdk.aws_lambda.Function(stack, "SetWebhookFunction", {
    ...functionProps,
    handler: functionHandler("setWebhook"),
    memorySize: undefined,
  }),
  logRetention: cdk.aws_logs.RetentionDays.ONE_DAY,
});
new cdk.CustomResource(stack, "SetWebhookResource", {
  serviceToken: setWebhookProvider.serviceToken,
  properties: { WebhookUrl: api.url + webhookPath, },
});

new cdk.aws_events.Rule(stack, "DailyMessageRule", {
  schedule: cdk.aws_events.Schedule.cron({ hour: "5", minute: "0" }),
  targets: [
    new cdk.aws_events_targets.LambdaFunction(
      new cdk.aws_lambda.Function(stack, "DailyMessageFunction", {
        ...functionProps,
        handler: functionHandler("sendDailyMessage"),
      }),
    ),
  ],
});

app.synth();
