Set the bot's webhook using:

```shell
curl --request POST \
     --url https://api.telegram.org/bot$TELEGRAM_API_TOKEN/setWebhook \
     --header 'content-type: application/json' \
     --data '{"url": "<CLOUDFORMATION_EXPORT>"}'
```

## Sources

https://core.telegram.org/bots/api
