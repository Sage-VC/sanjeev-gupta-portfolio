/**
 * SANJEEV GUPTA | EXECUTIVE COACHING & LEADERSHIP ADVISORY
 * Main Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  init4C2AModel();
  initAccordion();
  initInsightsFilter();
  initInsightModal();
  initContactForm();
});

/* --- Header Scroll Effect --- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- Mobile Menu Drawer --- */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-close-btn');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* --- 4C-2A Coaching Model Interactive Flow --- */
const modelStepsData = {
  contract: {
    num: "01",
    title: "Contract — Start with clarity",
    desc: "A meaningful engagement begins by understanding why we are having these conversations, what you would like to be different and what will make the engagement worthwhile. We agree the broad goals, expectations, ways of working and practical aspects of the engagement. Where coaching is sponsored by an organisation, contracting also creates clarity between the leader, sponsor and coach about the purpose and expected outcomes."
  },
  connect: {
    num: "02",
    title: "Connect — Create trust before going deeper",
    desc: "Good coaching requires openness, and openness is difficult without trust. I aim to create a safe, confidential and non-judgemental space where you can speak honestly — including about situations where you may be uncertain, uncomfortable or simply don't yet have an answer. For individuals investing in coaching themselves, Contract and Connect may naturally happen within the same initial session."
  },
  clarify: {
    num: "03",
    title: "Clarify — What is really going on?",
    desc: "The issue we begin with is not always the issue we eventually need to work on. Clarifying means slowing down enough to understand the situation before rushing towards a solution. Sometimes a better question is more useful than a quick answer."
  },
  awareness: {
    num: "04",
    title: "Create Awareness — See what you may not have seen before",
    desc: "Greater clarity can reveal assumptions, patterns and possibilities that are difficult to notice when you are inside the situation. We may explore how you are interpreting the situation, assumptions you are making, patterns in how you respond, how others may experience your behaviour, emotions influencing your response, strengths you may not be using fully, and choices or perspectives you have not considered. Greater awareness creates greater choice."
  },
  act: {
    num: "05",
    title: "Act — Turn awareness into meaningful action",
    desc: "Insight matters when it influences what happens next. That may mean making a decision, having a conversation you have been avoiding, delegating differently, responding differently under pressure, trying a new approach with your team, or taking a small step towards a larger career decision. Actions do not always need to be dramatic; small, conscious changes can create useful learning."
  },
  anchor: {
    num: "06",
    title: "Anchor — Review progress & sustain change",
    desc: "Sustainable change requires reflection, learning and reinforcement. Progress and commitments are revisited throughout the coaching journey — not simply to check whether an action was completed, but to understand what happened, what was learnt and what needs to change next. Sometimes this reinforces a new behaviour; sometimes it creates another question; and sometimes it takes us back into the cycle: Clarify ↔ Create Awareness ↔ Act ↔ Anchor."
  }
};

function init4C2AModel() {
  const pills = document.querySelectorAll('.model-step-pill');
  const detailTitle = document.getElementById('model-detail-title');
  const detailDesc = document.getElementById('model-detail-desc');
  const detailNum = document.getElementById('model-detail-num');

  if (!pills.length || !detailTitle || !detailDesc) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const stepKey = pill.getAttribute('data-step');
      const data = modelStepsData[stepKey];
      if (data) {
        detailTitle.textContent = data.title;
        detailDesc.textContent = data.desc;
        if (detailNum) detailNum.textContent = "Stage " + data.num;
      }
    });
  });
}

/* --- Accordions --- */
function initAccordion() {
  const accordions = document.querySelectorAll('.accordion-header');

  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close other siblings in the same accordion group if needed
      const parent = item.parentElement;
      parent.querySelectorAll('.accordion-item').forEach(sibling => {
        if (sibling !== item) {
          sibling.classList.remove('active');
          const siblingContent = sibling.querySelector('.accordion-content');
          if (siblingContent) siblingContent.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        item.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });
}

/* --- Insights Filter --- */
function initInsightsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.insight-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const theme = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cardTheme = card.getAttribute('data-theme');
        if (theme === 'all' || cardTheme === theme) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --- Insight Reader Modal --- */
const insightArticles = {
  "bottlenecks": {
    theme: "01 | Execution Leadership",
    title: "Why Capable Leaders Become Bottlenecks",
    body: `
      <p>As organizations scale and operational velocity increases, even the most capable and well-intentioned senior leaders find themselves in an unexpected trap: becoming the single largest decision-making bottleneck.</p>
      <p>When questions and approvals continually move upward, two detrimental dynamics emerge:</p>
      <ul style="list-style: disc; margin-left: 1.5rem; margin-bottom: 1.25rem;">
        <li>Senior executives spend their days firefighting routine operational queries instead of shaping longer-term strategic priorities.</li>
        <li>Next-in-line leaders stop developing their own judgement and ownership, defaulting to escalation whenever decisions involve ambiguity or risk.</li>
      </ul>
      <p>The solution is rarely to tell leaders to simply "delegate more." Sustainable delegation requires examining decision rights, psychological safety, governance mechanisms, and the underlying habits that cause senior leaders to equate control with quality.</p>
      <p>Real leadership depth emerges when leaders evolve from answering every question to creating the conditions where capable people make sound, confident decisions.</p>
    `
  },
  "either-or": {
    theme: "05 | Coaching Reflections",
    title: "Beyond Either-Or Thinking",
    body: `
      <p>Senior leaders often experience difficult dilemmas framed as polar opposites: <em>Delivery speed vs. quality</em>, <em>Empowerment vs. control</em>, <em>People empathy vs. business accountability</em>, or <em>Corporate career vs. personal freedom</em>.</p>
      <p>When trapped in binary thinking, leaders become exhausted trying to oscillate between two imperfect extremes. Coaching creates a reflective space to pause and examine the hidden assumptions behind the dilemma.</p>
      <p>Most strategic and leadership challenges are not problems to be solved with an "either-or" answer; they are polarities to be managed with greater nuance and integrative thinking.</p>
      <p>When you expand your awareness beyond false trade-offs, you discover higher-order choices that honor both operational rigor and long-term human sustainability.</p>
    `
  },
  "fix-system": {
    theme: "01 | Execution Leadership",
    title: "Fix the System, Not Just the Person",
    body: `
      <p>When delivery targets slip or escalations spike, the instinct in many organizations is to look for individual culpability: <em>"Who dropped the ball?" "Who needs performance management?"</em></p>
      <p>While individual capability matters, repeated execution friction across competent teams is almost always a symptom of systemic misalignment: conflicting cross-functional incentives, ambiguous ownership boundaries, overloaded communication channels, or outdated governance rituals.</p>
      <p>Before concluding that people need to be replaced or reprimanded, effective leaders step back to ask: <strong>"What in the system is making success unnecessarily difficult for capable people?"</strong></p>
      <p>Addressing the intersection of leadership behavior and operational design delivers transformations that endure long after immediate crises pass.</p>
    `
  },
  "confidence-credibility": {
    theme: "02 | Leadership in Practice",
    title: "Confidence Creates Credibility",
    body: `
      <p>In senior executive forums, technical mastery and operational data are baseline expectations. What distinguishes leaders who influence outcomes from those who merely present data is presence, clarity, and composed confidence under scrutiny.</p>
      <p>Credibility is not generated by having an immediate answer to every possible question. Credibility is built when a leader demonstrates the poise to acknowledge unknowns, ask incisive questions, frame issues with contextual clarity, and stand firmly behind their convictions.</p>
      <p>True executive confidence is grounded in self-awareness, alignment with core principles, and the emotional resilience to navigate pushback without becoming defensive.</p>
    `
  },
  "career-inflection": {
    theme: "04 | Career & Leadership Transitions",
    title: "When Your Career Reaches an Inflection Point",
    body: `
      <p>After twenty or thirty years of consistent upward progression, many accomplished leaders encounter a profound shift: <em>"What do I want the next phase of my professional life to look like?"</em></p>
      <p>At senior levels, career transitions are rarely just about finding another corporate title. They involve complex questions of personal identity, core values, legacy, autonomy, risk appetite, and what meaningful contribution looks like in this chapter.</p>
      <p>Navigating this inflection point requires intentional reflection rather than hurried action. It is about stepping back to align your vast reservoir of experience with the pursuits that bring genuine fulfillment and purpose.</p>
    `
  },
  "leaders-pressure": {
    theme: "02 | Leadership in Practice",
    title: "How Leaders Respond Under Pressure",
    body: `
      <p>Every leader has a default response mode when organizational stakes escalate and stress peaks. Some become overly directive and micro-manage; others withdraw into analysis paralysis or avoid contentious stakeholder confrontations.</p>
      <p>Your team and peers do not experience your intentions; they experience your behaviors and emotional state under pressure. A leader's heightened anxiety ripples across an entire department, stifling innovation and creating defensive silos.</p>
      <p>Executive coaching builds the critical gap between stimulus and response. By understanding your emotional triggers and physical cues, you can shift from automatic reaction to calm, deliberate leadership intent.</p>
    `
  }
};

function initInsightModal() {
  const modalBackdrop = document.getElementById('insight-modal');
  const modalTheme = document.getElementById('modal-theme');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modalBackdrop) return;

  const openModal = (articleId) => {
    const article = insightArticles[articleId];
    if (!article) return;

    if (modalTheme) modalTheme.textContent = article.theme;
    if (modalTitle) modalTitle.textContent = article.title;
    if (modalBody) modalBody.innerHTML = article.body;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = trigger.getAttribute('data-open-modal');
      openModal(articleId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --- Contact Form Handling --- */
function initContactForm() {
  const form = document.getElementById('executive-contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  const turnstileSiteKey = form.dataset.turnstileSitekey;
  let turnstileWidgetId = null;

  if (turnstileSiteKey) {
    const slot = form.querySelector('.turnstile-slot');
    window.onTurnstileLoad = () => {
      slot.hidden = false;
      turnstileWidgetId = window.turnstile.render(slot, { sitekey: turnstileSiteKey });
    };
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  const showNotice = (html, isError) => {
    form.querySelector('.form-notice')?.remove();
    const notice = document.createElement('div');
    notice.className = 'form-notice';
    notice.setAttribute('role', isError ? 'alert' : 'status');
    notice.style.marginTop = '1.5rem';
    notice.style.padding = '1.25rem';
    notice.style.background = isError ? '#FDF3F2' : '#F8F6F0';
    notice.style.border = `1px solid ${isError ? '#C0564B' : '#C5A880'}`;
    notice.style.borderRadius = '8px';
    notice.style.color = '#0F1D36';
    notice.style.fontSize = '0.95rem';
    notice.innerHTML = html;
    form.appendChild(notice);
  };

  const escapeHtml = (value) => value.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const resetButton = () => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
    submitBtn.style.background = '';
    submitBtn.style.color = '';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email || !message) {
      alert('Please complete the required fields (Name, Email, and Message) to start a conversation.');
      return;
    }

    const payload = {
      intent: form.querySelector('input[name="intent"]:checked')?.value || 'other',
      name,
      email,
      organisation: form.querySelector('#organisation')?.value.trim() || '',
      message,
      turnstileToken: form.querySelector('[name="cf-turnstile-response"]')?.value || ''
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Enquiry...</span>';

    let result;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      result = await res.json().catch(() => ({ ok: false }));
    } catch {
      result = { ok: false };
    }

    if (window.turnstile && turnstileWidgetId !== null) {
      window.turnstile.reset(turnstileWidgetId);
    }

    if (!result.ok) {
      resetButton();
      const reason = result.error ? escapeHtml(result.error) : 'Sorry, your message could not be sent.';
      showNotice(`
        <strong>${reason}</strong><br>
        You can also email me directly at
        <a href="mailto:sanjeev70.gupta@gmail.com">sanjeev70.gupta@gmail.com</a>.
      `, true);
      return;
    }

    submitBtn.innerHTML = '<span>Message Received</span>';
    submitBtn.style.background = '#0F1D36';
    submitBtn.style.color = '#C5A880';

    showNotice(`
      <strong>Thank you, ${escapeHtml(name)}.</strong><br>
      Your note has been received. I will review your situation and reach out to you directly to arrange an initial exploratory conversation.
    `, false);
    form.reset();

    setTimeout(resetButton, 5000);
  });
}
