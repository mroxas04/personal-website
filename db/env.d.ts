declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    DASHBOARD_OWNER_EMAIL?: string;
    TWILIO_AUTH_TOKEN?: string;
    TWILIO_SMS_WEBHOOK_URL?: string;
  }
}
