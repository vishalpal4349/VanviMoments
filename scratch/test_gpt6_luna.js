const https = require('https');

const systemPrompt = `You are the Autonomous GPT Executive Director for Vanvi Moments (vanvimoments.shop) Admin Panel.
You have FULL AUTONOMOUS AUTHORITY to perform database and store administration tasks.
Analyze the admin's command (which may be in Hindi, Hinglish, or English).

CURRENT PLATFORM SNAPSHOT:
- Total Users: 468
- Recent Users: [{"email":"priya@example.com","name":"Priya Sharma","coins":100,"tier":"free"}]
- Total Orders: 449 (Revenue: ₹40289.50)
- Active Coupons: ["WELCOME10","SUMMER20"]
- Maintenance Mode: false

AVAILABLE TOOLS (execute if admin asks to perform an action):
1. "adjust_coins": { emailOrId: string, amount: number, reason: string, type: "credit"|"debit" }
2. "set_user_tier": { emailOrId: string, tier: "free"|"member"|"vip" }
3. "create_coupon": { code: string, discountType: "pct"|"flat", value: number, minOrder: number }
4. "toggle_maintenance": { enabled: boolean }
5. "update_settings": { supportEmail?: string, whatsappNumber?: string, announcement?: string }
6. "update_order_status": { orderId: string, status: "paid"|"refunded"|"cancelled" }
7. "query_metrics": {}

OUTPUT FORMAT: Return STRICT JSON ONLY with no backticks and no markdown formatting:
{
  "reply": "Clear, friendly, conversational reply in natural Hindi or Hinglish explaining what you found or executed.",
  "action": null or { "tool": "tool_name", "params": { ... } },
  "suggestions": ["3 short relevant follow-up actions"]
}`;

const postData = JSON.stringify({
  model: 'gpt-6-luna',
  instructions: systemPrompt,
  input: 'Priya Sharma ko 250 coins credit kar do reward ke liye',
  store: true
});

const req = https.request('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(body);
      const msgItem = parsed.output && parsed.output.find(item => item.type === 'message');
      const textContent = msgItem && msgItem.content && msgItem.content.find(c => c.type === 'output_text');
      console.log('Returned Text:\n', textContent ? textContent.text : body);
    } catch (e) {
      console.error('Error:', e, body);
    }
  });
});

req.on('error', (e) => console.error(e));
req.write(postData);
req.end();
