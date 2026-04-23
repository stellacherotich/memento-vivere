import { useState, useEffect } from "react";

// ─── Palette & tokens ─────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --espresso:   #3A2A1E;
    --cream:      #F5F0E8;
    --parchment:  #EDE5D4;
    --warm-white: #FAF7F2;
    --ink:        #1C1A16;
    --muted:      #5C5650;
    --border:     #D8D0C0;
    --gold:       #7A5910;
    --gold-light: #B8943F;
    --gold-pale:  #F0E6C8;
    --moss:       #2C4A2E;
    --moss-light: #3D5A3E;
    --moss-pale:  #E8F0E8;
    --amber-pale: #F5EDD8;
    --purple:     #3C3489;
    --purple-pale:#EEEDFE;
    --sidebar-bg: #3A2A1E;
    --sidebar-accent: #B8943F;
  }

  /* ── Themes ── */
  [data-theme="midnight"] {
    --espresso: #1C1A16; --sidebar-bg: #1C1A16;
    --cream: #F5F0E8; --parchment: #EDE5D4; --warm-white: #FAF7F2;
  }
  [data-theme="blush"] {
    --espresso: #4A2830; --sidebar-bg: #3D2028;
    --cream: #FDF0F2; --parchment: #F5E0E4; --warm-white: #FFF6F8;
    --border: #E8C8CE; --gold: #8B3A4A; --gold-light: #C4556A;
    --moss: #8B3A4A; --moss-light: #C4556A; --moss-pale: #FAE8EC;
    --amber-pale: #FAE8EC; --sidebar-accent: #E8A0B0;
  }
  [data-theme="forest"] {
    --espresso: #1E2E1E; --sidebar-bg: #1A2A1A;
    --cream: #F0F5F0; --parchment: #E0EDE0; --warm-white: #F5FAF5;
    --border: #C0D4C0; --gold: #3A6B2A; --gold-light: #5A9A3A;
    --moss: #2C4A2E; --moss-light: #3D5A3E; --moss-pale: #DCF0DC;
    --sidebar-accent: #7ABF5A;
  }
  [data-theme="parchment"] {
    --espresso: #5C4A2A; --sidebar-bg: #4A3820;
    --cream: #FAF5E8; --parchment: #F0E8D0; --warm-white: #FDFAF0;
    --border: #D8C89A; --gold: #7A5910; --gold-light: #B8943F;
    --sidebar-accent: #D4A843;
  }
  [data-theme="dusk"] {
    --espresso: #1E1E30; --sidebar-bg: #18182A;
    --cream: #F0F0F8; --parchment: #E4E4F4; --warm-white: #F6F6FC;
    --border: #C8C8E0; --gold: #5050A0; --gold-light: #7070C0;
    --moss: #5050A0; --moss-light: #7070C0; --moss-pale: #E0E0F8;
    --amber-pale: #E8E8FC; --sidebar-accent: #A0A0E0;
  }
  [data-theme="espresso"] {
    --espresso: #3A2A1E; --sidebar-bg: #3A2A1E;
    --cream: #F5F0E8; --parchment: #EDE5D4; --warm-white: #FAF7F2;
    --sidebar-accent: #B8943F;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
  }

  .app { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width: 228px;
    min-height: 100vh;
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    padding: 32px 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 10;
  }

  .sidebar-brand {
    padding: 0 24px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .brand-mv {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 300;
    color: var(--cream);
    letter-spacing: 0.03em;
    line-height: 1.2;
  }

  .brand-mv em { font-style: italic; opacity: 0.6; }

  .brand-rule {
    width: 28px; height: 1px;
    background: var(--gold-light);
    opacity: 0.5;
    margin: 8px 0;
  }

  .brand-sub {
    font-size: 9px;
    font-weight: 500;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .sidebar-nav { padding: 24px 0; flex: 1; }

  .nav-section { padding: 0 16px; margin-bottom: 8px; }

  .nav-label {
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.2);
    padding: 0 8px; margin-bottom: 6px;
  }

  .nav-btn {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 9px 10px;
    border: none; border-radius: 8px;
    background: transparent;
    color: rgba(255,255,255,0.5);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    cursor: pointer; text-align: left;
    transition: all 0.15s; margin-bottom: 2px;
  }

  .nav-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
  .nav-btn.active { background: var(--moss-light); color: #fff; }
  .nav-btn .icon { font-size: 14px; width: 18px; text-align: center; }

  .sidebar-date {
    padding: 20px 24px 0;
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .sidebar-day {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px; font-weight: 300;
    color: var(--cream); line-height: 1;
  }

  .sidebar-month {
    font-size: 10px; color: rgba(255,255,255,0.3);
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-top: 4px;
  }

  /* ── Main ── */
  .main {
    margin-left: 228px;
    flex: 1;
    padding: 48px 52px;
    max-width: calc(100vw - 228px);
  }

  .page-header { margin-bottom: 36px; }

  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 300;
    color: var(--ink); letter-spacing: -0.01em;
  }

  .page-subtitle {
    font-size: 12px; color: var(--muted);
    margin-top: 5px; font-weight: 300;
    font-style: italic;
  }

  /* ── Cards ── */
  .card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 26px;
    margin-bottom: 18px;
  }

  .card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 500;
    color: var(--ink);
    margin-bottom: 18px;
    display: flex; align-items: center; gap: 10px;
  }

  .card-title .rule {
    width: 20px; height: 1px;
    background: var(--gold-light);
    flex-shrink: 0;
  }

  .section-label {
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 12px;
  }

  /* ── Grids ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  /* ── Tabs ── */
  .tab-nav {
    display: flex; gap: 4px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }

  .tab-btn {
    padding: 8px 18px;
    border: none; border-bottom: 2px solid transparent;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--muted);
    cursor: pointer; transition: all 0.15s;
    margin-bottom: -1px; font-weight: 400;
  }

  .tab-btn:hover { color: var(--ink); }
  .tab-btn.active { color: var(--moss); border-bottom-color: var(--moss-light); font-weight: 500; }

  /* ── Morning intention box ── */
  .intention-box {
    background: var(--parchment);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 18px;
    margin-bottom: 20px;
  }

  .intention-prompt {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-style: italic;
    color: var(--ink); margin-bottom: 10px;
    line-height: 1.4;
  }

  .intention-input {
    width: 100%; border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--ink);
    outline: none; resize: none;
    line-height: 1.7; min-height: 64px;
  }

  .intention-input::placeholder { color: #C4BAA8; }

  /* ── Control columns ── */
  .control-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 20px;
  }

  .control-col {
    border-radius: 10px;
    padding: 14px 16px;
    border: 1px solid var(--border);
  }

  .control-col.focus { background: var(--moss-pale); }
  .control-col.release { background: var(--amber-pale); }

  .control-col-head {
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    margin-bottom: 12px;
  }

  .control-col.focus .control-col-head { color: var(--moss); }
  .control-col.release .control-col-head { color: #6B4A10; }

  .control-row {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 8px;
  }

  .control-check {
    width: 14px; height: 14px;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    flex-shrink: 0; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    background: #fff;
  }

  .control-check.checked { background: var(--moss-light); border-color: var(--moss-light); }
  .control-check.checked::after { content: '✓'; color: #fff; font-size: 9px; font-weight: 700; }

  .control-input {
    flex: 1; border: none; background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--ink); outline: none;
  }

  .control-input::placeholder { color: #C4BAA8; }

  /* ── Task blocks ── */
  .task-block { margin-bottom: 20px; }

  .task-block-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 10px;
  }

  .task-bar {
    width: 3px; height: 20px;
    border-radius: 2px; flex-shrink: 0;
  }

  .task-bar.quick  { background: var(--moss-light); }
  .task-bar.tasks  { background: var(--gold-light); }
  .task-bar.deep   { background: var(--purple); }

  .task-block-label {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  .task-block-label.quick  { color: var(--moss); }
  .task-block-label.tasks  { color: #6B4A10; }
  .task-block-label.deep   { color: var(--purple); }

  .task-block-desc {
    font-size: 11px; color: var(--muted); font-style: italic;
  }

  .task-list { display: flex; flex-direction: column; gap: 6px; }

  .task-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: border-color 0.15s;
  }

  .task-item:hover { border-color: var(--moss-pale); }

  .task-check {
    width: 15px; height: 15px;
    border: 1.5px solid var(--border);
    border-radius: 3px; flex-shrink: 0;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; background: #fff;
  }

  .task-check.checked { background: var(--moss-light); border-color: var(--moss-light); }
  .task-check.checked::after { content: '✓'; color: #fff; font-size: 9px; font-weight: 700; }

  .task-text {
    flex: 1; border: none; background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--ink); outline: none;
  }

  .task-text.done { text-decoration: line-through; color: var(--muted); }
  .task-text::placeholder { color: #C4BAA8; }

  .task-del {
    width: 20px; height: 20px;
    border: none; background: transparent;
    color: var(--border); cursor: pointer;
    font-size: 14px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.15s;
  }

  .task-item:hover .task-del { opacity: 1; }
  .task-del:hover { color: #C0392B; }

  .add-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 12px;
    border: 1px dashed var(--border);
    border-radius: 8px; background: transparent;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; cursor: pointer;
    transition: all 0.15s; margin-top: 4px;
  }

  .add-btn:hover { border-color: var(--moss-pale); color: var(--moss); }

  /* ── Progress bar ── */
  .progress-wrap { margin-bottom: 20px; }

  .progress-meta {
    display: flex; justify-content: space-between;
    font-size: 11px; color: var(--muted); margin-bottom: 6px;
  }

  .progress-bar {
    height: 3px; background: var(--parchment);
    border-radius: 2px; overflow: hidden;
  }

  .progress-fill {
    height: 100%; background: var(--moss-light);
    border-radius: 2px; transition: width 0.4s ease;
  }

  /* ── Schedule ── */
  .schedule { display: flex; flex-direction: column; }

  .time-row {
    display: flex; align-items: stretch;
    min-height: 40px;
    border-bottom: 1px solid var(--parchment);
    transition: background 0.1s;
  }

  .time-row:hover { background: var(--parchment); }

  .time-label {
    width: 52px; flex-shrink: 0;
    font-size: 11px; color: var(--muted);
    font-weight: 500; padding: 10px 0;
    letter-spacing: 0.04em;
  }

  .time-input {
    flex: 1; border: none; background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--ink);
    padding: 8px 12px; resize: none; outline: none;
    line-height: 1.5;
  }

  .time-input::placeholder { color: #C4BAA8; }

  /* ── Reflection textarea ── */
  .reflect-prompt {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; font-style: italic;
    color: var(--ink); margin-bottom: 8px;
    line-height: 1.4;
  }

  .styled-textarea {
    width: 100%; border: 1px solid var(--border);
    border-radius: 10px; background: var(--cream);
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--ink); outline: none;
    resize: vertical; min-height: 80px; line-height: 1.6;
    transition: border-color 0.15s;
  }

  .styled-textarea:focus { border-color: var(--moss-light); }
  .styled-textarea::placeholder { color: #C4BAA8; }

  /* ── Energy ── */
  .energy-row { display: flex; gap: 8px; }

  .energy-btn {
    width: 36px; height: 36px; border-radius: 50%;
    border: 1.5px solid var(--border);
    background: transparent; cursor: pointer;
    font-size: 13px; font-weight: 500;
    color: var(--muted); transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
  }

  .energy-btn:hover { border-color: var(--gold-light); color: var(--gold); }
  .energy-btn.selected { background: var(--gold-light); border-color: var(--gold-light); color: #fff; }

  /* ── Mood pills ── */
  .mood-row { display: flex; gap: 8px; flex-wrap: wrap; }

  .mood-btn {
    padding: 7px 14px; border-radius: 20px;
    border: 1.5px solid var(--border);
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; cursor: pointer;
    transition: all 0.15s; color: var(--muted);
  }

  .mood-btn:hover { border-color: var(--border); color: var(--ink); }
  .mood-btn.selected { background: var(--espresso); border-color: var(--espresso); color: #fff; }

  /* ── Stoic quote ── */
  .stoic-quote {
    border-top: 1px solid var(--border);
    padding-top: 14px; margin-top: 4px;
  }

  .quote-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px; font-style: italic;
    color: var(--muted); line-height: 1.5;
  }

  .quote-attr {
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--gold); margin-top: 4px;
  }

  /* ── Weekly ── */
  .week-intention-box {
    background: var(--parchment);
    border: 1px solid var(--border);
    border-radius: 10px; padding: 16px 18px;
    margin-bottom: 18px;
  }

  .numbered-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 16px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .num-circle {
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--espresso); color: #fff;
    font-size: 11px; font-weight: 500;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .numbered-input {
    flex: 1; border: none; background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--ink); outline: none;
  }

  .numbered-input::placeholder { color: #C4BAA8; }

  .week-day-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 12px; padding: 14px;
  }

  .week-day-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-weight: 500;
    color: var(--ink); margin-bottom: 10px;
  }

  /* ── Habit tracker ── */
  .habit-grid { display: flex; flex-direction: column; gap: 10px; }

  .habit-row { display: flex; align-items: center; gap: 12px; }

  .habit-name-input {
    width: 140px; border: none; background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: var(--ink); outline: none; flex-shrink: 0;
    border-bottom: 1px solid var(--border);
    padding-bottom: 2px;
  }

  .habit-name-input::placeholder { color: #C4BAA8; }

  .habit-dots { display: flex; gap: 6px; }

  .habit-dot {
    width: 22px; height: 22px; border-radius: 6px;
    border: 1.5px solid var(--border);
    cursor: pointer; background: #fff;
    transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
  }

  .habit-dot.done { background: var(--moss-light); border-color: var(--moss-light); color: #fff; }
  .habit-dot.done::after { content: '✓'; }

  .habit-day-labels {
    display: flex; gap: 6px; margin-left: 152px; margin-bottom: 4px;
  }

  .day-label {
    width: 22px; text-align: center;
    font-size: 9px; font-weight: 500;
    color: var(--muted); letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── Goals ── */
  .virtue-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 14px; margin-bottom: 18px;
  }

  .virtue-card {
    border-radius: 10px; overflow: hidden;
    border: 1px solid var(--border);
  }

  .virtue-card-bar {
    padding: 8px 14px;
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #fff;
  }

  .virtue-card-bar.wisdom      { background: var(--moss-light); }
  .virtue-card-bar.courage     { background: #8B6914; }
  .virtue-card-bar.justice     { background: var(--purple); }
  .virtue-card-bar.temperance  { background: #7A2020; }

  .virtue-card-body {
    background: #fff; padding: 12px 14px;
  }

  .virtue-prompt {
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px; font-style: italic;
    color: var(--muted); margin-bottom: 10px;
    line-height: 1.4;
  }

  .goal-input {
    width: 100%; border: none;
    border-bottom: 1px solid var(--border);
    background: transparent; padding: 6px 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--ink); outline: none;
    margin-bottom: 6px;
    transition: border-color 0.15s;
  }

  .goal-input:focus { border-color: var(--moss-light); }
  .goal-input::placeholder { color: #C4BAA8; }

  .life-area { margin-bottom: 18px; }

  .life-area-title {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 8px;
  }

  /* ── Save toast ── */
  .save-toast {
    position: fixed; bottom: 24px; right: 32px;
    background: var(--espresso); color: var(--cream);
    padding: 10px 20px; border-radius: 20px;
    font-size: 12px; font-weight: 500;
    opacity: 0; transform: translateY(8px);
    transition: all 0.3s; pointer-events: none;
    z-index: 100;
  }

  .save-toast.show { opacity: 1; transform: translateY(0); }

  /* ── Theme switcher ── */
  .theme-switcher {
    padding: 16px 24px;
    border-top: 1px solid rgba(255,255,255,0.07);
    margin-top: 8px;
  }

  .theme-label {
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    margin-bottom: 10px;
  }

  .theme-dots {
    display: flex; gap: 8px; flex-wrap: wrap;
  }

  .theme-dot {
    width: 20px; height: 20px; border-radius: 50%;
    cursor: pointer; border: 2px solid transparent;
    transition: all 0.15s; flex-shrink: 0;
  }

  .theme-dot.active {
    border-color: rgba(255,255,255,0.7);
    transform: scale(1.15);
  }

  .theme-dot:hover { transform: scale(1.1); }

  /* ── Mobile theme row ── */
  .mobile-theme-row {
    display: none;
    gap: 8px; align-items: center;
    padding: 0 20px 10px;
    background: var(--sidebar-bg);
  }

  .mobile-theme-label {
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }

  /* ── Release row — strikethrough when released ── */
  .control-input.released {
    text-decoration: line-through;
    opacity: 0.45;
  }

  .release-check {
    width: 14px; height: 14px;
    border: 1.5px solid #C8A060;
    border-radius: 3px;
    flex-shrink: 0; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; background: #fff;
  }

  .release-check.released {
    background: #C8604040;
    border-color: #C8604080;
  }

  .release-check.released::after {
    content: '❌';
    font-size: 8px;
    line-height: 1;
  }

  /* ── Mobile bottom nav ── */
  .bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    height: 60px;
    background: var(--sidebar-bg);
    border-top: 1px solid rgba(255,255,255,0.08);
    z-index: 20;
  }

  .bottom-nav-inner { display: flex; height: 100%; }

  .bottom-nav-btn {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    border: none; background: transparent;
    color: rgba(255,255,255,0.45);
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 400;
    cursor: pointer; transition: color 0.15s;
    letter-spacing: 0.04em;
    -webkit-tap-highlight-color: transparent;
  }

  .bottom-nav-btn.active { color: #fff; }
  .bottom-nav-btn .bnav-icon { font-size: 18px; line-height: 1; }
  .bottom-nav-btn .bnav-label { font-size: 10px; }

  /* ── Mobile header ── */
  .mobile-header {
    display: none;
    background: var(--sidebar-bg);
    padding: 16px 20px 14px;
    position: sticky; top: 0; z-index: 15;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .mobile-header-brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 300;
    color: var(--cream); letter-spacing: 0.04em;
  }

  .mobile-header-brand em { font-style: italic; opacity: 0.6; }

  .mobile-header-date {
    font-size: 10px; color: rgba(255,255,255,0.3);
    letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px;
  }

  /* ── Tablet (≤768px) ── */
  @media (max-width: 768px) {
    .sidebar       { display: none; }
    .bottom-nav    { display: block; }
    .mobile-header { display: block; }

    .app { flex-direction: column; }

    .main {
      margin-left: 0;
      max-width: 100%;
      padding: 24px 20px 80px;
    }

    .page-header  { margin-bottom: 24px; }
    .page-title   { font-size: 28px; }

    .grid-2        { grid-template-columns: 1fr; }
    .control-cols  { grid-template-columns: 1fr; }
    .virtue-grid   { grid-template-columns: 1fr; }

    .card { padding: 20px 18px; }

    .habit-day-labels  { margin-left: 120px; }
    .habit-name-input  { width: 110px; }

    .save-toast { bottom: 72px; right: 20px; }
  }

  /* ── Small mobile (≤480px) ── */
  @media (max-width: 480px) {
    .main  { padding: 16px 14px 80px; }

    .page-title { font-size: 24px; }

    .card { padding: 16px 14px; border-radius: 12px; }

    .tab-btn { padding: 8px 10px; font-size: 12px; }

    .time-label  { width: 42px; font-size: 10px; }

    .energy-btn  { width: 32px; height: 32px; font-size: 12px; }

    .mood-btn    { padding: 6px 10px; font-size: 11px; }

    .habit-day-labels  { margin-left: 96px; }
    .habit-name-input  { width: 86px; }
    .habit-dot         { width: 20px; height: 20px; }

    .task-block-label  { font-size: 10px; }
    .numbered-item     { padding: 10px 12px; }
    .week-day-card     { padding: 12px; }
  }
`;

// ─── Storage helpers (localStorage) ──────────────────────────────────────────
const load = async (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const save = async (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

// ─── Constants ────────────────────────────────────────────────────────────────
const today    = new Date();
const todayKey = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
const DAYS     = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const HOURS = [];
for (let h = 6; h <= 21; h++) HOURS.push(`${h < 10 ? "0"+h : h}:00`);

const MOODS = ["Calm","Focused","Tired","Overwhelmed","Motivated","Anxious"];

const LIFE_AREAS = ["Work","Health","Relationships","Learning","Money","Rest"];

const QUOTES = [
  { text: "Confine yourself to the present.", attr: "Marcus Aurelius" },
  { text: "It's not what happens, but how you react that matters.", attr: "Epictetus" },
  { text: "Begin at once to live.", attr: "Seneca" },
  { text: "Waste no more time arguing what a good person should be — be one.", attr: "Marcus Aurelius" },
  { text: "The obstacle is the way.", attr: "Marcus Aurelius" },
  { text: "First say what you would be, then do what you must.", attr: "Epictetus" },
  { text: "We suffer more in imagination than in reality.", attr: "Seneca" },
];

const dailyQuote = QUOTES[today.getDate() % QUOTES.length];

// ─── TaskBlock sub-component ──────────────────────────────────────────────────
function TaskBlock({ barClass, labelClass, label, desc, tasks, onAdd, onToggle, onDelete, onEdit, placeholder }) {
  return (
    <div className="task-block">
      <div className="task-block-header">
        <div className={`task-bar ${barClass}`} />
        <span className={`task-block-label ${labelClass}`}>{label}</span>
        <span className="task-block-desc">{desc}</span>
      </div>
      <div className="task-list">
        {tasks.map(t => (
          <div className="task-item" key={t.id}>
            <div className={`task-check ${t.done ? "checked" : ""}`} onClick={() => onToggle(t.id)} />
            <input
              className={`task-text ${t.done ? "done" : ""}`}
              value={t.text}
              placeholder={placeholder}
              onChange={e => onEdit(t.id, e.target.value)}
            />
            <button className="task-del" onClick={() => onDelete(t.id)}>×</button>
          </div>
        ))}
        <button className="add-btn" onClick={onAdd}>+ Add</button>
      </div>
    </div>
  );
}

// ─── DailyPage ────────────────────────────────────────────────────────────────
function DailyPage({ state, setState }) {
  const [tab, setTab] = useState("morning");
  const setField = (k, v) => setState(s => ({ ...s, [k]: v }));

  const taskOps = (cat) => ({
    onAdd:    () => setField(cat, [...(state[cat]||[]), { id: Date.now(), text: "", done: false }]),
    onToggle: (id) => setField(cat, (state[cat]||[]).map(t => t.id===id ? {...t,done:!t.done} : t)),
    onDelete: (id) => setField(cat, (state[cat]||[]).filter(t => t.id!==id)),
    onEdit:   (id, v) => setField(cat, (state[cat]||[]).map(t => t.id===id ? {...t,text:v} : t)),
  });

  const allTasks = [...(state.quick||[]),...(state.tasks||[]),...(state.deep||[])];
  const done     = allTasks.filter(t => t.done).length;
  const total    = allTasks.length;

  const controlFocus   = state.focus   || ["","","",""];
  const controlRelease = state.release || [{text:"",done:false},{text:"",done:false},{text:"",done:false}];

  return (
    <>
      <div className="tab-nav">
        {[["morning","Morning"],["schedule","Schedule"],["evening","Evening"]].map(([id, lbl]) => (
          <button key={id} className={`tab-btn ${tab===id?"active":""}`} onClick={() => setTab(id)}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === "morning" && (
        <>
          <div className="card">
            <div className="card-title"><div className="rule"/> Morning intention</div>
            <div className="intention-box">
              <div className="intention-prompt">What does today need from me?</div>
              <textarea
                className="intention-input"
                placeholder="Write your intention for today…"
                value={state.intention||""}
                onChange={e => setField("intention", e.target.value)}
              />
            </div>

            <div className="section-label">What I can control today</div>
            <div className="control-cols">
              <div className="control-col focus">
                <div className="control-col-head">I will focus on</div>
                {controlFocus.map((val, i) => (
                  <div className="control-row" key={i}>
                    <div
                      className={`control-check ${val.trim() ? "checked" : ""}`}
                      onClick={() => {
                        const arr = [...controlFocus];
                        arr[i] = arr[i] ? "" : arr[i];
                        setField("focus", arr);
                      }}
                    />
                    <input
                      className="control-input"
                      placeholder={`Focus item ${i+1}…`}
                      value={val}
                      onChange={e => {
                        const arr = [...controlFocus];
                        arr[i] = e.target.value;
                        setField("focus", arr);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="control-col release">
                <div className="control-col-head">I will let go of</div>
                {controlRelease.map((item, i) => {
                  const val      = typeof item === "object" ? item.text  : item;
                  const released = typeof item === "object" ? item.done  : false;
                  return (
                    <div className="control-row" key={i}>
                      <div
                        className={`release-check ${released ? "released" : ""}`}
                        onClick={() => {
                          const arr = [...controlRelease];
                          arr[i] = { text: val, done: !released };
                          setField("release", arr);
                        }}
                      />
                      <input
                        className={`control-input ${released ? "released" : ""}`}
                        placeholder="Let go of…"
                        value={val}
                        onChange={e => {
                          const arr = [...controlRelease];
                          arr[i] = { text: e.target.value, done: released };
                          setField("release", arr);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title"><div className="rule"/> Today's tasks</div>
            {total > 0 && (
              <div className="progress-wrap">
                <div className="progress-meta">
                  <span>Progress</span><span>{done} / {total} done</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width:`${total?(done/total)*100:0}%`}} />
                </div>
              </div>
            )}
            <TaskBlock barClass="quick" labelClass="quick" label="Quick wins" desc="under 5 min"
              tasks={state.quick||[]} placeholder="Quick task…" {...taskOps("quick")} />
            <TaskBlock barClass="tasks" labelClass="tasks" label="Tasks" desc="up to 30 min"
              tasks={state.tasks||[]} placeholder="Task…" {...taskOps("tasks")} />
            <TaskBlock barClass="deep" labelClass="deep" label="Deep work" desc="30 min or more"
              tasks={state.deep||[]} placeholder="Deep work or project…" {...taskOps("deep")} />
          </div>
        </>
      )}

      {tab === "schedule" && (
        <div className="card">
          <div className="card-title"><div className="rule"/> Schedule</div>
          <div className="schedule">
            {HOURS.map(h => (
              <div className="time-row" key={h}>
                <span className="time-label">{h}</span>
                <textarea
                  className="time-input"
                  rows={1}
                  placeholder="—"
                  value={(state.schedule||{})[h]||""}
                  onChange={e => setField("schedule", {...(state.schedule||{}), [h]: e.target.value})}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "evening" && (
        <>
          <div className="card">
            <div className="card-title"><div className="rule"/> Evening review</div>
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              {[
                ["What went well today?", "wins"],
                ["What would I do differently?", "differently"],
                ["What am I glad happened today?", "grateful"],
              ].map(([prompt, key]) => (
                <div key={key}>
                  <p className="reflect-prompt">{prompt}</p>
                  <textarea
                    className="styled-textarea"
                    placeholder="Write here…"
                    value={state[key]||""}
                    onChange={e => setField(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title"><div className="rule"/> How I felt today</div>
            <div className="section-label" style={{marginBottom:10}}>Energy level</div>
            <div className="energy-row" style={{marginBottom:20}}>
              {[1,2,3,4,5].map(n => (
                <button key={n}
                  className={`energy-btn ${state.energy===n?"selected":""}`}
                  onClick={() => setField("energy", n)}>{n}</button>
              ))}
            </div>
            <div className="section-label" style={{marginBottom:10}}>State of mind</div>
            <div className="mood-row">
              {MOODS.map(m => (
                <button key={m}
                  className={`mood-btn ${state.mood===m?"selected":""}`}
                  onClick={() => setField("mood", m)}>{m}</button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="stoic-quote">
              <p className="quote-text">"{dailyQuote.text}"</p>
              <p className="quote-attr">{dailyQuote.attr}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── WeeklyPage ───────────────────────────────────────────────────────────────
function WeeklyPage({ state, setState }) {
  const setField = (k, v) => setState(s => ({ ...s, [k]: v }));

  return (
    <>
      <div className="card">
        <div className="card-title"><div className="rule"/> This week</div>
        <div className="week-intention-box">
          <p className="reflect-prompt" style={{marginBottom:10}}>What does this week mean to me?</p>
          <textarea
            className="styled-textarea"
            placeholder="This week I want to…"
            value={state.intention||""}
            onChange={e => setField("intention", e.target.value)}
          />
        </div>

        <div className="section-label">Three things I must do this week</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[0,1,2].map(i => (
            <div className="numbered-item" key={i}>
              <div className="num-circle">{i+1}</div>
              <input
                className="numbered-input"
                placeholder={`Goal ${i+1}…`}
                value={(state.goals||["","",""])[i]}
                onChange={e => {
                  const arr = [...(state.goals||["","",""])];
                  arr[i] = e.target.value;
                  setField("goals", arr);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title"><div className="rule"/> Week at a glance</div>
        <div className="grid-2">
          {DAYS.map(d => (
            <div className="week-day-card" key={d}>
              <div className="week-day-name">{d}</div>
              <textarea
                className="styled-textarea"
                rows={3}
                placeholder="Tasks & notes…"
                value={(state.days||{})[d]||""}
                onChange={e => setField("days",{...(state.days||{}),[d]:e.target.value})}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title"><div className="rule"/> Habits</div>
        <div className="habit-day-labels">
          {DAYS.map(d => <span className="day-label" key={d}>{d.slice(0,1)}</span>)}
        </div>
        <div className="habit-grid">
          {(state.habits||[{name:"",done:[]},{name:"",done:[]},{name:"",done:[]}]).map((h, i) => (
            <div className="habit-row" key={i}>
              <input
                className="habit-name-input"
                placeholder={`Habit ${i+1}…`}
                value={h.name}
                onChange={e => {
                  const arr = [...(state.habits||[])];
                  arr[i] = {...arr[i], name: e.target.value};
                  setField("habits", arr);
                }}
              />
              <div className="habit-dots">
                {DAYS.map((d, di) => (
                  <div key={d}
                    className={`habit-dot ${(h.done||[]).includes(di)?"done":""}`}
                    onClick={() => {
                      const arr  = [...(state.habits||[])];
                      const done = [...(arr[i].done||[])];
                      const idx  = done.indexOf(di);
                      if (idx > -1) done.splice(idx,1); else done.push(di);
                      arr[i] = {...arr[i], done};
                      setField("habits", arr);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          <button className="add-btn" style={{width:"fit-content",marginTop:4}}
            onClick={() => setField("habits",[...(state.habits||[]),{name:"",done:[]}])}>
            + Add habit
          </button>
        </div>
      </div>
    </>
  );
}

// ─── GoalsPage ────────────────────────────────────────────────────────────────
function GoalsPage({ state, setState }) {
  const setField = (k, v) => setState(s => ({ ...s, [k]: v }));

  const virtues = [
    { key: "wisdom",     barClass: "wisdom",     label: "Clear thinking",       prompt: "What do I need to learn or understand better?" },
    { key: "courage",    barClass: "courage",    label: "Doing hard things",    prompt: "What am I putting off that I need to face?" },
    { key: "justice",    barClass: "justice",    label: "Showing up for others",prompt: "How will I be a better person to those around me?" },
    { key: "temperance", barClass: "temperance", label: "Knowing when to stop", prompt: "What habits do I need to pull back on?" },
  ];

  return (
    <>
      <div className="card">
        <div className="card-title"><div className="rule"/> This quarter, I want to grow in</div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",color:"var(--muted)",marginBottom:18,lineHeight:1.5}}>
          "What stands in the way becomes the way." — Marcus Aurelius
        </p>
        <div className="virtue-grid">
          {virtues.map(v => (
            <div className="virtue-card" key={v.key}>
              <div className={`virtue-card-bar ${v.barClass}`}>{v.label}</div>
              <div className="virtue-card-body">
                <p className="virtue-prompt">{v.prompt}</p>
                {[0,1].map(i => (
                  <input key={i} className="goal-input"
                    placeholder="Write here…"
                    value={((state.virtues||{})[v.key]||["",""])[i]}
                    onChange={e => {
                      const arr = [...(((state.virtues||{})[v.key])||["",""])];
                      arr[i] = e.target.value;
                      setField("virtues",{...(state.virtues||{}),[v.key]:arr});
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><div className="rule"/> My goals this quarter</div>
          {LIFE_AREAS.map(area => (
            <div className="life-area" key={area}>
              <div className="life-area-title">{area}</div>
              <input className="goal-input"
                placeholder="Set a goal…"
                value={(state.seasonal||{})[area]||""}
                onChange={e => setField("seasonal",{...(state.seasonal||{}),[area]:e.target.value})}
              />
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title"><div className="rule"/> About me</div>
          {[
            ["My morning routine makes me feel…", "morningFeel"],
            ["I am most productive when…",        "productive"],
            ["What drains my energy…",            "drains"],
            ["My core values are…",               "values"],
            ["What motivates me most…",           "motivation"],
            ["What kind of person am I becoming?","becoming"],
          ].map(([prompt, key]) => (
            <div key={key} style={{marginBottom:16}}>
              <p className="reflect-prompt">{prompt}</p>
              <textarea className="styled-textarea" rows={2}
                placeholder="Write here…"
                value={state[key]||""}
                onChange={e => setField(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,   setPage]   = useState("daily");
  const [daily,  setDaily]  = useState({});
  const [weekly, setWeekly] = useState({});
  const [goals,  setGoals]  = useState({});
  const [loaded, setLoaded] = useState(false);
  const [toast,  setToast]  = useState(false);
  const [theme,  setTheme]  = useState(() => localStorage.getItem("mv-theme") || "espresso");

  const THEMES = [
    { id:"espresso",  label:"Espresso",  dot:"#3A2A1E" },
    { id:"midnight",  label:"Midnight",  dot:"#1C1A16" },
    { id:"blush",     label:"Blush",     dot:"#C4556A" },
    { id:"forest",    label:"Forest",    dot:"#2C3E2D" },
    { id:"parchment", label:"Parchment", dot:"#C9A84C" },
    { id:"dusk",      label:"Dusk",      dot:"#7070C0" },
  ];

  const applyTheme = (id) => {
    setTheme(id);
    localStorage.setItem("mv-theme", id);
  };

  useEffect(() => {
    (async () => {
      setDaily( (await load(`mv-daily-${todayKey}`)) || {});
      setWeekly((await load("mv-weekly"))            || {});
      setGoals( (await load("mv-goals"))             || {});
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      await save(`mv-daily-${todayKey}`, daily);
      await save("mv-weekly",            weekly);
      await save("mv-goals",             goals);
      setToast(true);
      setTimeout(() => setToast(false), 1800);
    }, 800);
    return () => clearTimeout(t);
  }, [daily, weekly, goals, loaded]);

  const dayName   = today.toLocaleDateString("en-GB", { weekday: "long" });
  const monthName = today.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const navItems = [
    { id:"daily",  icon:"📋", label:"Today"     },
    { id:"weekly", icon:"📅", label:"This Week"  },
    { id:"goals",  icon:"◇", label:"Goals"      },
  ];

  const titles = {
    daily:  { title: dayName,        sub: monthName },
    weekly: { title: "This week",    sub: "Intention, goals & habits" },
    goals:  { title: "Goals & growth", sub: "Who I am becoming" },
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app" data-theme={theme}>

        {/* Desktop sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-mv">Memento<br/><em>Vivere</em></div>
            <div className="brand-rule" />
            <div className="brand-sub">Daily Planner</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-label">Planning</div>
              {navItems.map(n => (
                <button key={n.id} className={`nav-btn ${page===n.id?"active":""}`}
                  onClick={() => setPage(n.id)}>
                  <span className="icon">{n.icon}</span>{n.label}
                </button>
              ))}
            </div>
          </nav>
          <div className="theme-switcher">
            <div className="theme-label">Theme</div>
            <div className="theme-dots">
              {THEMES.map(t => (
                <div key={t.id}
                  className={`theme-dot ${theme===t.id?"active":""}`}
                  style={{background: t.dot}}
                  title={t.label}
                  onClick={() => applyTheme(t.id)}
                />
              ))}
            </div>
          </div>
          <div className="sidebar-date">
            <div className="sidebar-day">{today.getDate()}</div>
            <div className="sidebar-month">
              {today.toLocaleDateString("en-GB",{month:"short",year:"numeric"})}
            </div>
          </div>
        </aside>

        {/* Mobile top header */}
        <header className="mobile-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div className="mobile-header-brand">Memento <em>Vivere</em></div>
              <div className="mobile-header-date">
                {today.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}
              </div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",paddingTop:2}}>
              {THEMES.map(t => (
                <div key={t.id}
                  className={`theme-dot ${theme===t.id?"active":""}`}
                  style={{background:t.dot,width:16,height:16}}
                  onClick={() => applyTheme(t.id)}
                />
              ))}
            </div>
          </div>
        </header>

        <main className="main">
          <div className="page-header">
            <h1 className="page-title">{titles[page].title}</h1>
            <p className="page-subtitle">{titles[page].sub}</p>
          </div>
          {page==="daily"  && <DailyPage  state={daily}  setState={setDaily}  />}
          {page==="weekly" && <WeeklyPage state={weekly} setState={setWeekly} />}
          {page==="goals"  && <GoalsPage  state={goals}  setState={setGoals}  />}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navItems.map(n => (
            <button key={n.id}
              className={`bottom-nav-btn ${page===n.id?"active":""}`}
              onClick={() => setPage(n.id)}>
              <span className="bnav-icon">{n.icon}</span>
              <span className="bnav-label">{n.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className={`save-toast ${toast?"show":""}`}>✓ Saved</div>
    </>
  );
}
