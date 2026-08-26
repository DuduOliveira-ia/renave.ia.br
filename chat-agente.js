/* Widget do assistente RENAVE — autocontido, sem dependencias externas.
   Troca API_URL depois do deploy no Vercel (ex.: https://renave-agente.vercel.app/api/chat). */
(function () {
  'use strict';

  var API_URL = 'https://renave-agente.vercel.app/api/chat';
  var WHATSAPP_NUMERO = '5531992650324';
  var STORAGE_KEY = 'renave_chat_v1';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function zapLink(msg) {
    return 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(msg);
  }

  function loadHistory() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-24)));
    } catch (e) {
      /* sessionStorage indisponivel (modo privado etc.) - segue sem persistir */
    }
  }

  var css = ''
    + '#renave-chat-btn{position:fixed;right:20px;bottom:20px;z-index:9999;'
    + 'width:58px;height:58px;border-radius:50%;background:#FFB800;color:#101215;'
    + 'border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.35);'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'transition:transform .16s cubic-bezier(.2,.9,.3,1.2);font-family:inherit}'
    + '#renave-chat-btn:hover{transform:translateY(-2px) scale(1.04)}'
    + '#renave-chat-btn svg{width:26px;height:26px}'
    + '#renave-chat-panel{position:fixed;right:20px;bottom:88px;z-index:9999;'
    + 'width:min(380px,calc(100vw - 40px));max-height:min(600px,calc(100vh - 120px));'
    + 'background:#14171c;border:1px solid #2b3038;border-radius:10px;'
    + 'display:none;flex-direction:column;overflow:hidden;'
    + 'box-shadow:0 20px 60px rgba(0,0,0,.5);'
    + 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","IBM Plex Sans",sans-serif}'
    + '#renave-chat-panel.open{display:flex}'
    + '#renave-chat-head{background:#101215;padding:14px 16px;border-bottom:1px solid #2b3038;'
    + 'display:flex;align-items:center;justify-content:space-between}'
    + '#renave-chat-head .t{font-family:Impact,"Arial Narrow Bold",sans-serif;'
    + 'color:#F5F2EA;font-size:15px;letter-spacing:.02em;text-transform:uppercase}'
    + '#renave-chat-head .s{font-family:ui-monospace,"IBM Plex Mono",monospace;'
    + 'color:#a8a49b;font-size:10px;letter-spacing:.08em;text-transform:uppercase;margin-top:2px}'
    + '#renave-chat-close{background:none;border:none;color:#a8a49b;cursor:pointer;'
    + 'font-size:20px;line-height:1;padding:4px 6px}'
    + '#renave-chat-close:hover{color:#FFB800}'
    + '#renave-chat-msgs{flex:1;overflow-y:auto;padding:14px 16px;display:flex;'
    + 'flex-direction:column;gap:10px;background:#101215}'
    + '.rc-msg{max-width:85%;padding:9px 12px;border-radius:10px;font-size:13.5px;'
    + 'line-height:1.5;white-space:pre-wrap;word-wrap:break-word}'
    + '.rc-msg.user{align-self:flex-end;background:#FFB800;color:#101215;'
    + 'border-bottom-right-radius:2px}'
    + '.rc-msg.bot{align-self:flex-start;background:#1e2228;color:#F5F2EA;'
    + 'border:1px solid #2b3038;border-bottom-left-radius:2px}'
    + '.rc-msg.err{align-self:flex-start;background:#2a1815;color:#ffb4a8;'
    + 'border:1px solid #4a2a22;font-size:12.5px}'
    + '.rc-typing{align-self:flex-start;display:flex;gap:4px;padding:10px 12px}'
    + '.rc-typing span{width:6px;height:6px;border-radius:50%;background:#6b727d;'
    + (reduceMotion ? '' : 'animation:rc-bounce 1.1s infinite ease-in-out;')
    + '}'
    + '.rc-typing span:nth-child(2){animation-delay:.15s}'
    + '.rc-typing span:nth-child(3){animation-delay:.3s}'
    + '@keyframes rc-bounce{0%,60%,100%{opacity:.35;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}'
    + '#renave-chat-foot{border-top:1px solid #2b3038;padding:10px 12px;background:#14171c}'
    + '#renave-chat-form{display:flex;gap:8px}'
    + '#renave-chat-input{flex:1;background:#1e2228;border:1px solid #2b3038;border-radius:7px;'
    + 'color:#F5F2EA;padding:9px 11px;font-size:13.5px;font-family:inherit;resize:none;'
    + 'max-height:80px;line-height:1.4}'
    + '#renave-chat-input:focus{outline:2px solid #FFB800;outline-offset:1px;border-color:#FFB800}'
    + '#renave-chat-send{background:#FFB800;color:#101215;border:none;border-radius:7px;'
    + 'padding:0 14px;font-weight:700;font-size:13px;cursor:pointer;flex:none}'
    + '#renave-chat-send:disabled{opacity:.5;cursor:default}'
    + '#renave-chat-zap{display:block;text-align:center;margin-top:8px;font-size:11.5px;'
    + 'color:#a8a49b;text-decoration:none;font-family:ui-monospace,"IBM Plex Mono",monospace;'
    + 'letter-spacing:.03em}'
    + '#renave-chat-zap:hover{color:#FFB800}'
    + '@media (max-width:480px){#renave-chat-panel{right:10px;left:10px;width:auto;bottom:80px;'
    + 'max-height:calc(100vh - 100px)}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'renave-chat-btn';
  btn.setAttribute('aria-label', 'Abrir chat de dúvidas sobre o RENAVE');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

  var panel = document.createElement('div');
  panel.id = 'renave-chat-panel';
  panel.innerHTML =
    '<div id="renave-chat-head">' +
      '<div><div class="t">Dúvida sobre o RENAVE?</div><div class="s">resposta na hora</div></div>' +
      '<button id="renave-chat-close" aria-label="Fechar chat">&times;</button>' +
    '</div>' +
    '<div id="renave-chat-msgs" role="log" aria-live="polite"></div>' +
    '<div id="renave-chat-foot">' +
      '<form id="renave-chat-form">' +
        '<textarea id="renave-chat-input" rows="1" placeholder="Escreva sua dúvida..." aria-label="Sua dúvida"></textarea>' +
        '<button id="renave-chat-send" type="submit">Enviar</button>' +
      '</form>' +
      '<a id="renave-chat-zap" target="_blank" rel="noopener">prefere direto no WhatsApp? →</a>' +
    '</div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var msgsEl = panel.querySelector('#renave-chat-msgs');
  var formEl = panel.querySelector('#renave-chat-form');
  var inputEl = panel.querySelector('#renave-chat-input');
  var sendEl = panel.querySelector('#renave-chat-send');
  var zapEl = panel.querySelector('#renave-chat-zap');
  var closeEl = panel.querySelector('#renave-chat-close');

  zapEl.href = zapLink('Olá! Estava conversando com o assistente do site sobre o RENAVE e quero continuar por aqui.');

  var history = loadHistory();
  var open = false;
  var busy = false;

  function renderMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'rc-msg ' + (role === 'user' ? 'user' : role === 'error' ? 'err' : 'bot');
    div.textContent = text;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function renderAll() {
    msgsEl.innerHTML = '';
    if (history.length === 0) {
      renderMsg('bot', 'Oi. Pergunta o que quiser sobre o RENAVE — prazo, credenciamento, custo, o que muda na rotina da sua loja.');
      return;
    }
    history.forEach(function (m) { renderMsg(m.role, m.content); });
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'rc-typing';
    div.id = 'renave-chat-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('renave-chat-typing');
    if (el) el.remove();
  }

  function togglePanel(force) {
    open = typeof force === 'boolean' ? force : !open;
    panel.classList.toggle('open', open);
    if (open) {
      renderAll();
      setTimeout(function () { inputEl.focus(); }, 50);
    }
  }

  btn.addEventListener('click', function () { togglePanel(); });
  closeEl.addEventListener('click', function () { togglePanel(false); });

  inputEl.addEventListener('input', function () {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + 'px';
  });

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formEl.requestSubmit();
    }
  });

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    var text = inputEl.value.trim();
    if (!text) return;

    history.push({ role: 'user', content: text });
    saveHistory(history);
    renderMsg('user', text);
    inputEl.value = '';
    inputEl.style.height = 'auto';

    busy = true;
    sendEl.disabled = true;
    showTyping();

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('http_' + res.status);
        return res.json();
      })
      .then(function (data) {
        hideTyping();
        var reply = (data && data.reply) || 'Não consegui responder agora — tenta de novo ou fala direto no WhatsApp.';
        history.push({ role: 'assistant', content: reply });
        saveHistory(history);
        renderMsg('bot', reply);
      })
      .catch(function () {
        hideTyping();
        renderMsg('error', 'Deu um problema pra responder agora. Tenta de novo em instantes, ou fala direto no WhatsApp (link abaixo).');
      })
      .finally(function () {
        busy = false;
        sendEl.disabled = false;
      });
  });
})();
