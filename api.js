async function callClaude(tool, userMessage) {
  const apiKey = window.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'sk-ant-YOUR_KEY_HERE') {
    throw new Error('API key not set. Please open config.js and paste your Anthropic API key.');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: PROMPTS[tool],
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${res.status}`);
  }

  const data = await res.json();
  return data.content[0].text;
}