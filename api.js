async function callClaude(tool, userMessage) {
  const systemPrompt = PROMPTS[tool];

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: systemPrompt,
      user: userMessage
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.error?.message || 'API error');
  }

  return data.result;
}