import * as cdk from "monocdk";
import * as path from "path";

const {
  TELEGRAM_API_TOKEN,
  TELEGRAM_CHAT_ID = ""
} = process.env;

if (!TELEGRAM_API_TOKEN) {
  throw new Error("Missing TELEGRAM_API_TOKEN");
}

const app = new cdk.App();
const stack = new cdk.Stack(app, "Telegram-DehliBot");

const projectRoot = path.resolve(__dirname, "../../");

export const codeFromPath = (relativePath: string) =>
  cdk.aws_lambda.Code.fromAsset(path.resolve(projectRoot, relativePath));

const modulesLayer = new cdk.aws_lambda.LayerVersion(stack, "Layer", {
  code: codeFromPath("./layer")
});

const srcCode = codeFromPath("./out/src");

const webhookIntegration = new cdk.aws_apigatewayv2_integrations.LambdaProxyIntegration({
  handler: new cdk.aws_lambda.Function(stack, "TelegramFunction", {
    code: srcCode,
    handler: "index.handler",
    layers: [modulesLayer],
    memorySize: 2048,
    runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
    timeout: cdk.Duration.seconds(29),
    environment: {
      TELEGRAM_API_TOKEN,
      TELEGRAM_CHAT_ID
    },
    logRetention: cdk.aws_logs.RetentionDays.ONE_DAY
  })
});

const webhookPath = TELEGRAM_API_TOKEN.replace(":", "/");

const api = new cdk.aws_apigatewayv2.HttpApi(stack, "DehliBotApi");
api.addRoutes({
  path: "/" + webhookPath,
  methods: [cdk.aws_apigatewayv2.HttpMethod.POST],
  integration: webhookIntegration
});

const setWebhookProvider = new cdk.custom_resources.Provider(stack, "SetWebhookProvider", {
  onEventHandler: new cdk.aws_lambda.Function(stack, "SetWebhookFunction", {
    code: srcCode,
    handler: "handlers/setWebhook.handler",
    layers: [modulesLayer],
    runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
    logRetention: cdk.aws_logs.RetentionDays.ONE_DAY
  }),
  logRetention: cdk.aws_logs.RetentionDays.ONE_DAY
});
new cdk.CustomResource(stack, "SetWebhookResource", {
  serviceToken: setWebhookProvider.serviceToken,
  properties: {
    TelegramApiToken: TELEGRAM_API_TOKEN,
    WebhookUrl: api.url + webhookPath
  }
});

app.synth();
