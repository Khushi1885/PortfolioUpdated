if (typeof emailjs !== 'undefined') {
  try { emailjs.init("UDuBfxP7mxYmsJQyM"); } catch (e) { console.warn('[EmailJS] init failed:', e); }
} else {
  console.warn('[EmailJS] library did not load — contact form will show an error on submit instead of crashing the page.');
}
/**
 * script.js — Khushi · AI Engineer Portfolio
 * ──────────────────────────────────────────────────────────
 * Modules:
 *  1. initHeader()          — Sticky header scroll class
 *  2. initMobileNav()       — Hamburger open / close
 *  3. initActiveNav()       — Highlight active nav link on scroll
 *  4. initReveal()          — Intersection-observer scroll reveals
 *  5. initTiltCards()       — Mouse-follow 3D tilt on cards
 *  6. initOrbParallax()     — Hero orb gently follows the cursor
 *  7. initHeroRoles()       — Rotating role text in hero
 *  8. initFloatingWidget()  — Floating FAB, welcome toast, sliding panel
 *  9. initAIAssistant()     — Local knowledge-base powered chat
 * 10. initContactForm()     — Validation + EmailJS submission
 * ──────────────────────────────────────────────────────────
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   1. HEADER
═══════════════════════════════════════════════════════════ */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ═══════════════════════════════════════════════════════════
   2. MOBILE NAV
═══════════════════════════════════════════════════════════ */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ═══════════════════════════════════════════════════════════
   3. ACTIVE NAV LINK
═══════════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));
})();


/* ═══════════════════════════════════════════════════════════
   4. SCROLL REVEAL
═══════════════════════════════════════════════════════════ */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  const seen    = new Set();

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);

      const parent = entry.target.parentElement;
      const inGrid = parent && parent.matches(
        '.skills-grid, .projects-grid, .about-grid, .cert-grid, .timeline'
      );
      if (inGrid && !entry.target.style.getPropertyValue('--d')) {
        const siblings = Array.from(parent.children);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.setProperty('--d', (idx * 0.07) + 's');
      }

      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(t => io.observe(t));
})();


/* ═══════════════════════════════════════════════════════════
   5. TILT CARDS — subtle 3D mouse-follow tilt
═══════════════════════════════════════════════════════════ */
(function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  cards.forEach(card => {
    let raf = null;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top)  / rect.height;  // 0..1

      const rotateX = (0.5 - y) * 7;  // deg
      const rotateY = (x - 0.5) * 7;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
})();


/* ═══════════════════════════════════════════════════════════
   6. ORB PARALLAX — hero orb gently tracks the cursor
═══════════════════════════════════════════════════════════ */
(function initOrbParallax() {
  const stage = document.getElementById('orbStage');
  const core  = document.getElementById('orbCore');
  if (!stage || !core) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let raf = null;

  stage.addEventListener('mousemove', e => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      core.style.transform = `translate(calc(-50% + ${x * 14}px), calc(-50% + ${y * 14}px))`;
    });
  });

  stage.addEventListener('mouseleave', () => {
    if (raf) cancelAnimationFrame(raf);
    core.style.transform = 'translate(-50%, -50%)';
  });
})();


/* ═══════════════════════════════════════════════════════════
   7. HERO ROLE ROTATOR
═══════════════════════════════════════════════════════════ */
(function initHeroRoles() {
  const el = document.getElementById('heroRoles');
  if (!el) return;

  const roles = [
    'AI Engineer',
    'Machine Learning Enthusiast',
    'Generative AI Developer',
    'Backend Developer',
    'Full-Stack Developer'
  ];
  let i = 0;

  setInterval(() => {
    i = (i + 1) % roles.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.innerHTML = `<span class="role-active">${roles[i]}</span>`;
      el.style.opacity = '1';
    }, 250);
  }, 2600);

  el.style.transition = 'opacity .25s ease';
})();


/* ═══════════════════════════════════════════════════════════
   8. FLOATING AI WIDGET — FAB, welcome toast, sliding panel
═══════════════════════════════════════════════════════════ */
const AIWidget = (function initFloatingWidget() {

  const widget   = document.querySelector('.ai-widget');
  const fab      = document.getElementById('aiFab');
  const overlay  = document.getElementById('aiOverlay');
  const panel    = document.getElementById('aiPanel');
  const closeBtn = document.getElementById('aiClose');
  const toast    = document.getElementById('welcomeToast');
  const toastClose = document.getElementById('toastClose');
  const iconOpen  = document.getElementById('fabIconOpen');
  const iconClose = document.getElementById('fabIconClose');
  const chatInput = document.getElementById('chatInput');

  if (!fab || !panel || !overlay) return { open(){}, close(){} };

  let isOpen = false;
  let toastTimer = null;
  let toastDismissed = false;

  function open() {
    if (isOpen) return;
    isOpen = true;
    panel.classList.add('open');
    overlay.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    widget.classList.add('panel-open');
    if (iconOpen) iconOpen.style.display = 'none';
    if (iconClose) iconClose.style.display = 'inline';
    hideToast();
    document.body.style.overflow = 'hidden';
    setTimeout(() => chatInput && chatInput.focus(), 400);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('open');
    overlay.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    widget.classList.remove('panel-open');
    if (iconOpen) iconOpen.style.display = 'inline';
    if (iconClose) iconClose.style.display = 'none';
    document.body.style.overflow = '';
  }

  function toggle() { isOpen ? close() : open(); }

  function showToast() {
    if (toastDismissed || isOpen || !toast) return;
    toast.classList.add('show');
  }
  function hideToast() {
    if (!toast) return;
    toast.classList.remove('show');
  }

  fab.addEventListener('click', toggle);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) close();
  });

  if (toastClose) {
    toastClose.addEventListener('click', e => {
      e.stopPropagation();
      toastDismissed = true;
      hideToast();
    });
  }
  if (toast) {
    toast.addEventListener('click', () => {
      toastDismissed = true;
      hideToast();
      open();
    });
  }

  // Welcome tooltip toast, 4s after first load
  toastTimer = setTimeout(showToast, 4000);

  // Any element with data-ai-open="1" opens the panel instead of navigating
  document.querySelectorAll('[data-ai-open]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      toastDismissed = true;
      clearTimeout(toastTimer);
      hideToast();
      open();
    });
  });

  return { open, close };
})();


/* ═══════════════════════════════════════════════════════════
   9. AI RECRUITER ASSISTANT
   A local, keyword-matched knowledge base built from Khushi's
   resume. No external API — everything runs client-side.
═══════════════════════════════════════════════════════════ */
(function initAIAssistant() {

  const chatBody  = document.getElementById('chatBody');
  const chatForm  = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatChips = document.getElementById('chatChips');
  if (!chatBody || !chatForm || !chatInput) return;

  /* ---------- Knowledge base ---------- */
  const KB = [
    {
      id: 'resume',
      keywords: ['resume', 'summary', 'summarize', 'overview', 'background', 'about her', 'who is khushi'],
      answer: `Khushi is a final-year **B.Tech Computer Engineering** student (Amritsar Group of Colleges, 2023–2027) with hands-on full-stack development experience.

Core stack: \`Python\`, \`Java\`, \`JavaScript\`, \`HTML5/CSS3\`, \`Flask\`. She completed a 6-week **Python AI/ML Developer internship** at Solitaire Infosys, and has shipped four projects spanning ML recommendation systems, a safety-focused REST API backend, and a generative-AI interview prep tool.

- 5 certifications across ML, cloud, and software engineering
- 2nd place, MindSpace Hackathon
- Open to internships and entry-level AI/full-stack roles`,
      tags: ['Python', 'Flask', 'Machine Learning', 'Full-Stack']
    },
    {
      id: 'ai_interview_project',
      keywords: ['interview assistant', 'interview prep', 'enterprise ai assistant', 'ai interview'],
      answer: `**AI Interview Preparation Assistant** — a full-stack web app that generates role-specific technical and HR interview questions from a candidate's profile and uploaded resume.

- Integrates generative AI APIs for personalized feedback, answer evaluation, and readiness scoring
- User authentication and progress tracking
- Cloud-based data storage on Firebase/Supabase`,
      tags: ['Generative AI', 'Firebase', 'Supabase', 'Auth']
    },
    {
      id: 'ai_projects',
      keywords: ['ai project', 'projects', 'what has she built', 'show me her work', 'portfolio projects'],
      answer: `Khushi's shipped projects:

- **Women Safety Application** — Flask/REST API backend with real-time location tracking and emergency-alert endpoints
- **Smartflix** — ML movie recommendation engine using cosine-similarity over a 10,000+ entry dataset
- **AI Interview Preparation Assistant** — generative-AI powered interview coach with personalized feedback
- **Personal Portfolio Website** — responsive full-stack site with a live contact form

Ask "Open GitHub" to see the code.`,
      tags: ['Flask', 'Machine Learning', 'Generative AI', 'REST API']
    },
    {
      id: 'internship',
      keywords: ['internship', 'intern', 'work experience', 'solitaire', 'job experience'],
      answer: `**Python AI/ML Developer Intern** — Solitaire Infosys, Mohali (Jun–Jul 2025, 6 weeks).

- Built and tested Python backend modules in a structured, version-controlled environment
- Built data pipelines with \`Pandas\`/\`NumPy\` to clean and transform structured datasets
- Produced EDA reports and visualizations with \`Matplotlib\`/\`Seaborn\`, working alongside senior engineers`,
      tags: ['Python', 'Pandas', 'NumPy', 'Git/GitHub']
    },
    {
      id: 'ai_tech',
      keywords: ['ai technolog', 'machine learning skill', 'ml tech', 'what technologies', 'tech stack', 'tools does she know', 'technical skill'],
      answer: `AI/ML side: \`Machine Learning\` fundamentals, \`Pandas\`/\`NumPy\` for data pipelines, \`Matplotlib\`/\`Seaborn\` for EDA, and **generative AI API integration** for personalized feedback systems.

Surrounding stack: \`Flask\`, \`REST APIs\`, \`SQL\`/\`Firebase\`/\`Supabase\`, \`Git\`/\`GitHub\`, and AWS cloud fundamentals.`,
      tags: ['Machine Learning', 'Generative AI', 'Pandas', 'NumPy']
    },
    {
      id: 'certifications',
      keywords: ['certificat', 'courses', 'nptel', 'qualifications'],
      answer: `Certifications:

- **Cloud Computing** — IIT Kharagpur (NPTEL), 2026
- **Software Engineering** — IIT Kharagpur (NPTEL), 2025
- **Introduction to Machine Learning** — IIT Madras (NPTEL), 2026
- **Deep Learning for Developers** — Infosys Springboard, 2026
- **Python AI / Machine Learning** — VMM Education, 2024`,
      tags: ['NPTEL', 'Machine Learning', 'Cloud Computing']
    },
    {
      id: 'education',
      keywords: ['education', 'degree', 'college', 'university', 'school', 'academic'],
      answer: `**B.Tech, Computer Engineering** — Amritsar Group of Colleges (Aug 2023 – May 2027), currently in her final year.

Backed by 5 certifications from IIT Kharagpur, IIT Madras, and Infosys Springboard covering cloud computing, software engineering, and machine learning.`,
      tags: ['B.Tech', 'Computer Engineering']
    },
    {
      id: 'strengths',
      keywords: ['strength', 'what makes her good', 'good at', 'superpower'],
      answer: `Her strengths, backed by evidence:

- **Ships working software** — 4 deployed projects, not just coursework
- **Full-stack range** — comfortable from a Flask backend to a React/JS frontend
- **Fast learner** — 5 certifications across ML, cloud, and software engineering in under 2 years
- **Performs under pressure** — 2nd place at MindSpace Hackathon`,
      tags: ['Full-Stack', 'Fast Learner']
    },
    {
      id: 'why_hire',
      keywords: ['why hire', 'why should we hire', 'why choose her', 'why should i hire'],
      answer: `Because she doesn't just study AI — she ships it. Real projects with real API contracts, a completed AI/ML internship, hackathon recognition, and a full-stack skill set that runs from database schema to deployed frontend.

She's a final-year student actively looking for internships and entry-level AI/full-stack roles — low-risk, high-upside hire.`,
      tags: ['AI/ML Internship', 'Full-Stack']
    },
    {
      id: 'github',
      keywords: ['github', 'open github', 'repo', 'source code', 'see the code'],
      answer: `Here's her GitHub: **github.com/Khushi1885**. Opening it in a new tab now.`,
      tags: [],
      action: () => window.open('https://github.com/Khushi1885/', '_blank', 'noopener')
    },
    {
      id: 'resume_download',
      keywords: ['download resume', 'download cv', 'resume pdf', 'get her resume', 'send resume'],
      answer: `Downloading Khushi's resume now — check your downloads folder.`,
      tags: [],
      action: () => {
        const a = document.createElement('a');
        a.href = 'assets/Khushi_Resume_Updated.pdf';
        a.download = 'Khushi_Resume_Updated.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    },
    {
      id: 'contact',
      keywords: ['contact', 'email', 'reach her', 'linkedin', 'get in touch'],
      answer: `You can reach Khushi at **khushinew75@gmail.com**, on LinkedIn (linkedin.com/in/khushi-nayyar), or via the contact form further down this page.`,
      tags: ['Email', 'LinkedIn']
    }
  ];

  const FALLBACK = "I'm designed to answer questions specifically about Khushi's professional background, AI projects, technical skills, education, and experience.";

  /* ---------- Matching ---------- */
  function findAnswer(query) {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    let best = null;
    let bestScore = 0;

    KB.forEach(entry => {
      let score = 0;
      entry.keywords.forEach(kw => {
        if (q.includes(kw)) score += kw.split(' ').length; // longer phrase matches score higher
      });
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });

    return bestScore > 0 ? best : null;
  }

  /* ---------- Rendering ---------- */
  function renderMarkdown(text) {
    // Minimal markdown: **bold**, `code`, and "- " bullet lists.
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${inlineMd(trimmed.slice(2))}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        if (trimmed) html += `<p>${inlineMd(trimmed)}</p>`;
      }
    });
    if (inList) html += '</ul>';
    return html;
  }

  function inlineMd(str) {
    return str
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  }

  function scrollChatToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg msg-user';
    msg.innerHTML = `
      <div class="msg-avatar"><i class="ph ph-user"></i></div>
      <div class="msg-bubble">${escapeHtml(text)}</div>
    `;
    chatBody.appendChild(msg);
    scrollChatToBottom();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function addTypingIndicator() {
    const msg = document.createElement('div');
    msg.className = 'msg msg-bot';
    msg.id = 'typingIndicator';
    msg.innerHTML = `
      <div class="msg-avatar"><img src="assets/khushi-avatar.jpg" alt="" /></div>
      <div class="msg-bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    `;
    chatBody.appendChild(msg);
    scrollChatToBottom();
    return msg;
  }

  function streamBotMessage(entry) {
    const typing = addTypingIndicator();

    setTimeout(() => {
      typing.remove();

      const answer = entry ? entry.answer : FALLBACK;
      const tags = entry ? (entry.tags || []) : [];

      const msg = document.createElement('div');
      msg.className = 'msg msg-bot';
      msg.innerHTML = `
        <div class="msg-avatar"><img src="assets/khushi-avatar.jpg" alt="" /></div>
        <div class="msg-bubble"><span class="stream-target"></span></div>
      `;
      chatBody.appendChild(msg);
      scrollChatToBottom();

      const target = msg.querySelector('.stream-target');
      const fullHtml = renderMarkdown(answer);

      // Stream by revealing the rendered HTML progressively via a temp container,
      // walking through text nodes for a natural "typing" feel.
      const temp = document.createElement('div');
      temp.innerHTML = fullHtml;
      const plain = temp.textContent;
      let i = 0;
      const speed = Math.max(6, Math.min(18, Math.floor(600 / plain.length)));

      const interval = setInterval(() => {
        i += 3;
        if (i >= plain.length) {
          clearInterval(interval);
          target.innerHTML = fullHtml;

          if (tags.length) {
            const tagRow = document.createElement('div');
            tagRow.className = 'msg-tags';
            tagRow.innerHTML = tags.map(t => `<span>${escapeHtml(t)}</span>`).join('');
            msg.querySelector('.msg-bubble').appendChild(tagRow);
          }

          if (entry && typeof entry.action === 'function') {
            setTimeout(entry.action, 300);
          }
        } else {
          target.textContent = plain.slice(0, i);
        }
        scrollChatToBottom();
      }, speed);

    }, 550);
  }

  function handleQuery(query) {
    addUserMessage(query);
    chatInput.value = '';
    const entry = findAnswer(query);
    streamBotMessage(entry);
  }

  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = chatInput.value.trim();
    if (!q) return;
    handleQuery(q);
  });

  if (chatChips) {
    chatChips.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      handleQuery(chip.dataset.q);
    });
  }

})();


/* ═══════════════════════════════════════════════════════════
   10. CONTACT FORM (EmailJS Integration)
═══════════════════════════════════════════════════════════ */
(function initContactForm() {

  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const feedOk    = document.getElementById('formOk');
  const feedBad   = document.getElementById('formBad');
  if (!form) return;

  function validate(name, value) {
    const v = value.trim();
    if (name === 'name') {
      if (!v) return 'Name is required.';
      if (v.length < 2) return 'Please enter your full name.';
    }
    if (name === 'email') {
      if (!v) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        return 'Please enter a valid email address.';
    }
    if (name === 'message') {
      if (!v) return 'Message is required.';
      if (v.length < 10)
        return 'Message must be at least 10 characters.';
    }
    return '';
  }

  function setErr(fieldId, errId, msg) {
    const input = document.getElementById(fieldId);
    const span  = document.getElementById(errId);
    if (input) input.classList.toggle('err', !!msg);
    if (span) span.textContent = msg;
  }

  [['name','nameErr'],['email','emailErr'],['message','msgErr']].forEach(([id, errId]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => setErr(id, errId, validate(id, el.value)));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('name').value;
    const email   = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const nErr = validate('name', name);
    const eErr = validate('email', email);
    const mErr = validate('message', message);

    setErr('name','nameErr',nErr);
    setErr('email','emailErr',eErr);
    setErr('message','msgErr',mErr);

    if (nErr || eErr || mErr) return;

    const label   = submitBtn.querySelector('.btn-label');
    const spinner = submitBtn.querySelector('.btn-spin');

    submitBtn.disabled = true;
    label.style.display = 'none';
    spinner.style.display = 'flex';

    feedOk.style.display = 'none';
    feedBad.style.display = 'none';

    try {

      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS did not load (network/ad-blocker).');
      }

      await emailjs.send(
        "service_b7nktvj",
        "template_7a7nw9i",
        { name: name, email: email, message: message }
      );

      form.reset();
      feedOk.style.display = 'flex';

      setTimeout(() => { feedOk.style.display = 'none'; }, 6000);

    } catch (err) {

      console.error('[Contact Form]', err);
      feedBad.style.display = 'flex';

      setTimeout(() => { feedBad.style.display = 'none'; }, 5000);

    } finally {

      submitBtn.disabled = false;
      label.style.display = 'flex';
      spinner.style.display = 'none';

    }

  });

})();
