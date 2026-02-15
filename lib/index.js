/**
 * DocuExtract Webhooks
 * Trigger workflows on document extraction events
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * Webhook Event Types
 */
const EventTypes = {
  EXTRACTION_COMPLETE: 'extraction.complete',
  EXTRACTION_FAILED: 'extraction.failed',
  PROVIDER_HEALTH_CHANGE: 'provider.health_change',
  USAGE_THRESHOLD: 'usage.threshold'
};

/**
 * DocuExtract Webhook Client
 */
class WebhookClient {
  /**
   * Create webhook client
   * @param {Object} options
   * @param {string} options.gatewayUrl - DocuExtract Gateway URL
   * @param {string} options.webhookUrl - Your webhook endpoint
   * @param {string} options.secret - Webhook signing secret
   */
  constructor(options = {}) {
    this.gatewayUrl = options.gatewayUrl || 'http://localhost:3000';
    this.webhookUrl = options.webhookUrl;
    this.secret = options.secret;
    this.listeners = new Map();
    
    if (this.webhookUrl) {
      this.registerGatewayWebhook();
    }
  }

  /**
   * Register webhook with gateway
   */
  async registerGatewayWebhook() {
    try {
      await axios.post(`${this.gatewayUrl}/api/webhooks/register`, {
        url: this.webhookUrl,
        events: Object.values(EventTypes)
      });
      console.log('Webhook registered successfully');
    } catch (error) {
      console.error('Failed to register webhook:', error.message);
    }
  }

  /**
   * Subscribe to an event
   * @param {string} eventType 
   * @param {Function} callback 
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  /**
   * Handle incoming webhook
   * @param {Object} payload 
   */
  async handleWebhook(payload) {
    const { eventType, data, timestamp, signature } = payload;
    
    // Verify signature if secret is configured
    if (this.secret && !this.verifySignature(payload, signature)) {
      throw new Error('Invalid webhook signature');
    }
    
    const callbacks = this.listeners.get(eventType) || [];
    for (const callback of callbacks) {
      try {
        await callback(data);
      } catch (error) {
        console.error(`Webhook handler error for ${eventType}:`, error);
      }
    }
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload, signature) {
    // Simple verification - in production use HMAC
    return true;
  }

  /**
   * Create webhook payload
   */
  static createPayload(eventType, data) {
    return {
      eventType,
      data,
      timestamp: new Date().toISOString(),
      id: uuidv4()
    };
  }
}

module.exports = { WebhookClient, EventTypes };
