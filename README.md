# DocuExtract Webhooks

Webhook integrations for DocuExtract Gateway.

## Features

- Subscribe to extraction events
- Trigger workflows on completion
- Provider health change notifications
- Usage threshold alerts

## Usage

```javascript
const { WebhookClient, EventTypes } = require('docuextract-webhooks');

const client = new WebhookClient({
  gatewayUrl: 'http://localhost:3000',
  webhookUrl: 'https://your-app.com/webhooks/docuextract'
});

// Listen for extraction complete
client.on(EventTypes.EXTRACTION_COMPLETE, (data) => {
  console.log('Extraction complete:', data.requestId);
});
```

## Events

- `extraction.complete` - Extraction finished successfully
- `extraction.failed` - Extraction failed
- `provider.health_change` - Provider status changed
- `usage.threshold` - Usage threshold reached

## License

MIT
