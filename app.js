// ── Tab Switching ──────────────────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById('tab-' + target).classList.add('active');
  });
});

// ── API Key Banner ──────────────────────────────────────────────
function checkApiKey() {
  const key = window.ANTHROPIC_API_KEY || '';
  const banner = document.getElementById('api-banner');
  if (key && key !== 'sk-ant-YOUR_KEY_HERE') {
    banner.classList.add('hidden');
  }
}
checkApiKey();

// ── Toast Helper ───────────────────────────────────────────────
let toastTimer;
function showToast(msg = '✓ Copied to clipboard') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Copy Helper ────────────────────────────────────────────────
function setupCopy(copyBtnId, outputId) {
  document.getElementById(copyBtnId).addEventListener('click', () => {
    const text = document.getElementById(outputId).textContent;
    if (!text || text === 'Output will appear here…') return;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById(copyBtnId);
      btn.textContent = '✓ Copied!';
      btn.classList.add('copied');
      showToast();
      setTimeout(() => {
        btn.textContent = '📋 Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
}

setupCopy('copy-gst', 'out-gst');
setupCopy('copy-reminder', 'out-reminder');
setupCopy('copy-engagement', 'out-engagement');
setupCopy('copy-itr', 'out-itr');

// ── Generic Generate Handler ───────────────────────────────────
async function handleGenerate({ btnId, outputId, buildPrompt }) {
  const btn = document.getElementById(btnId);
  const out = document.getElementById(outputId);

  // Validate
  const prompt = buildPrompt();
  if (!prompt) return; // validation inside buildPrompt shows alert

  // Loading state
  btn.disabled = true;
  btn.classList.add('loading');
  out.classList.remove('empty', 'error');
  out.textContent = 'Generating…';

  // Extract tool key from btnId: "btn-gst" → "gst"
  const tool = btnId.replace('btn-', '');

  try {
    const result = await callClaude(tool, prompt);
    out.textContent = result;
  } catch (err) {
    out.textContent = '⚠ Error: ' + err.message;
    out.classList.add('error');
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

// ── Tool 1: GST Invoice ────────────────────────────────────────
document.getElementById('btn-gst').addEventListener('click', () => {
  handleGenerate({
    btnId: 'btn-gst',
    outputId: 'out-gst',
    buildPrompt() {
      const service = document.getElementById('gst-service').value.trim();
      const client  = document.getElementById('gst-client').value.trim();
      const period  = document.getElementById('gst-period').value.trim();
      if (!service || !client || !period) {
        alert('Please fill in Service Type, Client Name, and Billing Period.');
        return null;
      }
      return `Service type: ${service}\nClient name: ${client}\nBilling period: ${period}`;
    }
  });
});

// ── Tool 2: Client Reminder ────────────────────────────────────
document.getElementById('btn-reminder').addEventListener('click', () => {
  handleGenerate({
    btnId: 'btn-reminder',
    outputId: 'out-reminder',
    buildPrompt() {
      const client   = document.getElementById('rem-client').value.trim();
      const item     = document.getElementById('rem-item').value.trim();
      const deadline = document.getElementById('rem-deadline').value;
      const firm     = document.getElementById('rem-firm').value.trim();
      if (!client || !item || !deadline || !firm) {
        alert('Please fill in all fields: Client Name, Pending Item, Deadline, and Firm Name.');
        return null;
      }
      const formatted = new Date(deadline + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
      return `Client name: ${client}\nPending item: ${item}\nDeadline date: ${formatted}\nFirm name: ${firm}`;
    }
  });
});

// ── Tool 3: Engagement Letter ──────────────────────────────────
document.getElementById('btn-engagement').addEventListener('click', () => {
  handleGenerate({
    btnId: 'btn-engagement',
    outputId: 'out-engagement',
    buildPrompt() {
      const client  = document.getElementById('eng-client').value.trim();
      const firm    = document.getElementById('eng-firm').value.trim();
      const scope   = document.getElementById('eng-scope').value.trim();
      const fee     = document.getElementById('eng-fee').value.trim();
      const payment = document.getElementById('eng-payment').value.trim();
      if (!client || !firm || !scope || !fee || !payment) {
        alert('Please fill in all fields.');
        return null;
      }
      return `Client name: ${client}\nFirm name: ${firm}\nScope of work: ${scope}\nFee: ${fee}\nPayment terms: ${payment}`;
    }
  });
});

// ── Tool 4: ITR Notice Reply ───────────────────────────────────
document.getElementById('btn-itr').addEventListener('click', () => {
  handleGenerate({
    btnId: 'btn-itr',
    outputId: 'out-itr',
    buildPrompt() {
      const section     = document.getElementById('itr-section').value.trim();
      const ay          = document.getElementById('itr-ay').value.trim();
      const issue       = document.getElementById('itr-issue').value.trim();
      const explanation = document.getElementById('itr-explanation').value.trim();
      if (!section || !ay || !issue || !explanation) {
        alert('Please fill in all fields: Notice Section, Assessment Year, Issue, and Client\'s Explanation.');
        return null;
      }
      return `Notice section: ${section}\nAssessment year: ${ay}\nIssue raised: ${issue}\nClient's explanation: ${explanation}`;
    }
  });
});