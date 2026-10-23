/**
 * RODR | DESIGN — Porsche 911 Showcase
 * main.js
 */
(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────────────── */
  const WIPE_HALF   = 260;   // ms – half of CSS --t-mid
  const WIPE_HOLD   = 80;    // ms – pause at full opacity before revealing next scene
  const LOOP_OFFSET = 0.06;  // s  – seek back this many seconds before scene_end

  /* ── State ───────────────────────────────────────────────── */
  let models        = [];
  let activeId      = null;
  let busy          = false;

  /* ── Elements ────────────────────────────────────────────── */
  const vid         = document.getElementById('vid');
  const wipe        = document.getElementById('wipe');
  const card        = document.querySelector('.card');
  const stage       = document.getElementById('stage');
  const pips        = () => document.querySelectorAll('.pip');
  const titleBlocks = () => document.querySelectorAll('.title-block');
  const specBlocks  = () => document.querySelectorAll('.spec-block');

  /* ── Boot ────────────────────────────────────────────────── */
  function boot() {
    try {
      models = JSON.parse(document.getElementById('data').textContent);
    } catch (e) {
      console.error('[showcase] Could not load model data', e);
      return;
    }

    if (!models.length) return;

    activeId = models[0].id;
    wireNav();
    initVideo();
  }

  /* ── Nav ─────────────────────────────────────────────────── */
  function wireNav() {
    pips().forEach(pip => {
      pip.addEventListener('click', () => {
        if (pip.dataset.id !== activeId && !busy) go(pip.dataset.id);
      });
      pip.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pip.click(); }
      });
    });
  }

  /* ── Video init ──────────────────────────────────────────── */
  function initVideo() {
    if (!vid) return;

    card.classList.add('card--loading');

    function onReady() {
      card.classList.remove('card--loading');
      playSegment(models[0]);
    }

    if (vid.readyState >= 3) {
      onReady();
    } else {
      vid.addEventListener('canplay', onReady, { once: true });
    }

    vid.addEventListener('error', () => {
      card.classList.remove('card--loading');
      fallback();
    });

    /* Loop current segment */
    vid.addEventListener('timeupdate', () => {
      if (busy) return;
      const m = models.find(x => x.id === activeId);
      if (!m) return;
      if (vid.currentTime >= m.scene_end - LOOP_OFFSET) {
        vid.currentTime = m.scene_start;
        vid.play().catch(() => {});
      }
    });
  }

  /* ── Play a segment ──────────────────────────────────────── */
  function playSegment(m) {
    if (!vid || !m) return;
    vid.currentTime = m.scene_start;
    const p = vid.play();
    if (p && p.catch) {
      p.catch(() => {
        /* autoplay blocked – resume on next interaction */
        const resume = () => { vid.play().catch(() => {}); };
        document.addEventListener('pointerdown', resume, { once: true });
        document.addEventListener('keydown',     resume, { once: true });
      });
    }
  }

  /* ── Transition between models ───────────────────────────── */
  function go(targetId) {
    const target = models.find(x => x.id === targetId);
    if (!target) return;

    busy = true;

    /* 1 – wipe in (cover) */
    wipe.classList.add('wipe--in');

    /* 2 – swap content at peak opacity */
    setTimeout(() => {
      deactivateAll();
      activate(targetId);
      playSegment(target);
      activeId = targetId;
    }, WIPE_HALF + WIPE_HOLD);

    /* 3 – wipe out (reveal) */
    setTimeout(() => {
      wipe.classList.remove('wipe--in');
      setTimeout(() => { busy = false; }, WIPE_HALF);
    }, WIPE_HALF * 2 + WIPE_HOLD);
  }

  /* ── DOM helpers ─────────────────────────────────────────── */
  function deactivateAll() {
    pips().forEach(p => {
      p.classList.remove('pip--on');
      p.setAttribute('aria-pressed', 'false');
    });
    titleBlocks().forEach(b => {
      b.classList.remove('title-block--on');
      b.setAttribute('aria-hidden', 'true');
    });
    specBlocks().forEach(b => {
      b.classList.remove('spec-block--on');
      b.setAttribute('aria-hidden', 'true');
    });
  }

  function activate(id) {
    pips().forEach(p => {
      if (p.dataset.id === id) {
        p.classList.add('pip--on');
        p.setAttribute('aria-pressed', 'true');
      }
    });
    titleBlocks().forEach(b => {
      if (b.dataset.id === id) {
        b.classList.add('title-block--on');
        b.setAttribute('aria-hidden', 'false');
      }
    });
    specBlocks().forEach(b => {
      if (b.dataset.id === id) {
        b.classList.add('spec-block--on');
        b.setAttribute('aria-hidden', 'false');
      }
    });

    /* spec §7 / §10c — update background context on the stage */
    const m = models.find(x => x.id === id);
    if (m && stage) {
      stage.dataset.bg = m.background || '';
    }
  }

  /* ── CSS fallback car ────────────────────────────────────── */
  function fallback() {
    if (!vid) return;
    vid.style.display = 'none';

    const colors = { 'f-series':'#B83228', '964':'#9EA0A4', '993':'#B2B4B8', 'orange':'#C85A0E' };
    const stage  = document.querySelector('.stage');
    if (!stage) return;

    /* inject keyframes once */
    const s = document.createElement('style');
    s.textContent = `
      .fb { position:absolute; inset:0; background:#EAE4D8; display:flex;
            align-items:center; justify-content:center; overflow:hidden; z-index:1; }
      .fb-car { position:relative; animation: fbDrive 3.2s ease-in-out infinite alternate; }
      @keyframes fbDrive { from{transform:translateX(-24px)} to{transform:translateX(24px)} }
      .fb-body { width:140px; height:56px; background:var(--cc); border-radius:6px 28px 6px 6px;
                 box-shadow:0 6px 20px rgba(0,0,0,.22); }
      .fb-w { position:absolute; bottom:-14px; width:30px; height:30px;
              background:#222; border-radius:50%; border:3px solid #555;
              animation: fbSpin .55s linear infinite; }
      @keyframes fbSpin { to{transform:rotate(360deg)} }
      .fb-w-f { right:14px; } .fb-w-r { left:14px; }
    `;
    document.head.appendChild(s);

    const m = models.find(x => x.id === activeId) || models[0];
    const cc = colors[m ? m.id : 'f-series'] || '#888';
    const el = document.createElement('div');
    el.className = 'fb';
    el.innerHTML = `<div class="fb-car" style="--cc:${cc}">
      <div class="fb-body"></div>
      <div class="fb-w fb-w-f"></div>
      <div class="fb-w fb-w-r"></div>
    </div>`;
    stage.prepend(el);
  }

  /* ── Visibility: pause when tab hidden ───────────────────── */
  document.addEventListener('visibilitychange', () => {
    if (!vid) return;
    document.hidden ? vid.pause() : vid.play().catch(() => {});
  });

  /* ── Kick off ────────────────────────────────────────────── */
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();

}());
