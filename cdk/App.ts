import * as cdk from "monocdk";
import * as path from "path";

const {
  TELEGRAM_API_TOKEN = "",
  TELEGRAM_CHAT_ID = ""
} = process.env;

const app = new cdk.App();
const stack = new cdk.Stack(app, "Telegram-DehliBot");

const projectRoot = path.resolve(__dirname, "../../");

const modulesLayer = new cdk.aws_lambda.LayerVersion(stack, "Layer", {
  code: cdk.aws_lambda.Code.fromAsset(path.resolve(projectRoot, "./layer"))
});

const telegramIntegration = new cdk.aws_apigatewayv2_integrations.LambdaProxyIntegration({
  handler: new cdk.aws_lambda.Function(stack, "TelegramFunction", {
    code: cdk.aws_lambda.Code.fromAsset(path.resolve(projectRoot, "./out/src")),
    handler: "index.handler",
    layers: [modulesLayer],
    memorySize: 2048,
    runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
    timeout: cdk.Duration.seconds(29),
    environment: {
      TELEGRAM_API_TOKEN,
      TELEGRAM_CHAT_ID
    }
  })
});

const api = new cdk.aws_apigatewayv2.HttpApi(stack, "Api");
api.addRoutes({
  path: "/telegram",
  methods: [cdk.aws_apigatewayv2.HttpMethod.POST],
  integration: telegramIntegration
});

app.synth();
