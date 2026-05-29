# CA AI Toolkit

4 AI-powered tools for Indian CA firms — built with plain HTML, CSS, JS.

## Tools
1. GST Invoice Description Generator
2. Client Reminder Email Writer
3. Engagement Letter Drafter
4. ITR Notice Reply Drafter

## Setup (2 steps)

### Step 1 — Get API Key
1. Go to https://console.anthropic.com
2. Sign up → Add card → Load $5
3. Go to **API Keys** → Create → Copy

### Step 2 — Paste Key
Open `config.js` and replace `sk-ant-YOUR_KEY_HERE` with your actual key.

## Run Locally
1. Install VS Code extension: **Live Server** (by Ritwick Dey)
2. Right-click `index.html` → **Open with Live Server**
3. App opens at `http://127.0.0.1:5500`

## File Structure
```
ca-toolket/
├── index.html   ← UI: tabs, forms, output boxes
├── style.css    ← dark professional styling
├── prompts.js   ← 4 system prompts for Claude
├── api.js       ← callClaude() function
├── config.js    ← YOUR API KEY GOES HERE (never commit)
├── app.js       ← tab switching, form logic, event handlers
└── .gitignore   ← excludes config.js from git
```

## ⚠️ Security Note
`config.js` is in `.gitignore`. Never push it to GitHub.
Before sharing the app publicly, move the API key to a backend proxy (see handoff doc).

## Cost Estimate
~₹0.08–0.25 per generation at current Claude Sonnet rates.