/* ============================================================================
   GRIMORA — script.js
   ----------------------------------------------------------------------------
   Vanilla JS, sem dependências. Carregado com defer (não bloqueia a renderização).

   Módulos:
   00. CONFIG                ← TROCAR DADOS DE CONTATO AQUI
   01. Menu mobile
   02. Header ao rolar
   03. Link ativo na navegação (scrollspy)
   04. Animações de entrada (reveal)
   05. Botões "Solicitar proposta"
   06. Formulário de contato
   07. Ano no rodapé
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     00. CONFIG — único lugar para alterar os dados de contato.
     ATENÇÃO: o número também aparece no index.html em 3 pontos (link do
     WhatsApp na seção de contato, no rodapé e no botão flutuante). Se trocar
     aqui, troque lá também — basta procurar por "5511945948096".
     ========================================================================== */
  var CONFIG = {
    // Formato: código do país + DDD + número, só dígitos.
    whatsapp: '5511945948096',
    email: 'publicidadegrimora@gmail.com',
    // Texto que abre a conversa quando o formulário é enviado.
    saudacao: 'Olá, Grimora! Vim pelo site.'
  };


  /* ==========================================================================
     01. MENU MOBILE
     ========================================================================== */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('is-locked');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      var willOpen = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      navToggle.classList.toggle('is-open', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
      navToggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('is-locked', willOpen);
    });

    // fecha ao clicar em qualquer link do menu
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // fecha com ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }


  /* ==========================================================================
     02. HEADER AO ROLAR — adiciona fundo/blur depois de sair do topo
     ========================================================================== */
  var header = document.getElementById('header');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ==========================================================================
     03. LINK ATIVO NA NAVEGAÇÃO (scrollspy)
     Marca no menu a seção que está visível na tela.
     ========================================================================== */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, {
      // considera "ativa" a seção que cruza a faixa central da tela
      rootMargin: '-45% 0px -50% 0px',
      threshold: 0
    });

    sections.forEach(function (section) { spy.observe(section); });
  }


  /* ==========================================================================
     04. ANIMAÇÕES DE ENTRADA (reveal)
     ========================================================================== */
  var revealEls = document.querySelectorAll('.reveal');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    // fallback: mostra tudo imediatamente
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // anima só uma vez
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // Rede de segurança: se por qualquer motivo o observer não disparar
    // (aba aberta em segundo plano, extensão do navegador, etc.), o conteúdo
    // acima da dobra aparece assim mesmo. Nunca deixa a página em branco.
    window.setTimeout(function () {
      document.querySelectorAll('.hero .reveal:not(.is-visible)').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }, 2500);
  }


  /* ==========================================================================
     05. BOTÕES "SOLICITAR PROPOSTA"
     Preenchem o campo de mensagem com o pacote escolhido e levam ao formulário.
     ========================================================================== */
  var mensagemField = document.getElementById('mensagem');

  document.querySelectorAll('[data-proposta]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pacote = btn.getAttribute('data-proposta');

      if (mensagemField) {
        mensagemField.value = 'Tenho interesse na solução "' + pacote + '". ';
      }

      var contato = document.getElementById('contato');
      if (contato) contato.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });

      // foca a mensagem depois da rolagem, sem "puxar" a tela de volta
      window.setTimeout(function () {
        if (!mensagemField) return;
        mensagemField.focus({ preventScroll: true });
        var end = mensagemField.value.length;
        mensagemField.setSelectionRange(end, end);
      }, prefersReducedMotion ? 0 : 700);
    });
  });


  /* ==========================================================================
     06. FORMULÁRIO DE CONTATO
     ========================================================================== */
  var form = document.getElementById('contatoForm');
  var status = document.getElementById('formStatus');

  /* --- Máscara simples de telefone: (11) 91234-5678 --- */
  var whatsInput = document.getElementById('whatsapp');
  if (whatsInput) {
    whatsInput.addEventListener('input', function () {
      var d = whatsInput.value.replace(/\D/g, '').slice(0, 11);
      var out = d;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 7) {
        var corte = d.length > 10 ? 7 : 6; // celular (9 dígitos) x fixo (8 dígitos)
        out = '(' + d.slice(0, 2) + ') ' + d.slice(2, corte) + '-' + d.slice(corte);
      }
      whatsInput.value = out;
    });
  }

  /* --- Validação --- */
  function setError(name, message) {
    var input = document.getElementById(name);
    if (!input) return;
    var field = input.closest('.field');
    var slot = document.querySelector('[data-error-for="' + name + '"]');
    if (field) field.classList.toggle('has-error', Boolean(message));
    if (slot) slot.textContent = message || '';
  }

  function validate(data) {
    var ok = true;

    if (data.nome.length < 2) { setError('nome', 'Informe o seu nome.'); ok = false; }
    else setError('nome', '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      setError('email', 'Informe um e-mail válido.'); ok = false;
    } else setError('email', '');

    if (data.whatsappDigits.length < 10) {
      setError('whatsapp', 'Informe o WhatsApp com DDD.'); ok = false;
    } else setError('whatsapp', '');

    if (data.mensagem.length < 10) {
      setError('mensagem', 'Conte um pouco mais sobre o projeto.'); ok = false;
    } else setError('mensagem', '');

    return ok;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // campo honeypot preenchido = robô. Finge sucesso e não envia nada.
      if (form.site && form.site.value) return;

      var data = {
        nome: form.nome.value.trim(),
        empresa: form.empresa.value.trim(),
        email: form.email.value.trim(),
        whatsapp: form.whatsapp.value.trim(),
        whatsappDigits: form.whatsapp.value.replace(/\D/g, ''),
        mensagem: form.mensagem.value.trim()
      };

      if (!validate(data)) {
        if (status) status.textContent = 'Confira os campos destacados acima.';
        var firstError = form.querySelector('.field.has-error input, .field.has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      /* ----------------------------------------------------------------------
         ENVIO — versão atual: monta a mensagem e abre o WhatsApp.
         Funciona sem nenhum backend.
         ---------------------------------------------------------------------- */
      var texto =
        CONFIG.saudacao + '\n\n' +
        'Nome: ' + data.nome + '\n' +
        (data.empresa ? 'Empresa: ' + data.empresa + '\n' : '') +
        'E-mail: ' + data.email + '\n' +
        'WhatsApp: ' + data.whatsapp + '\n\n' +
        data.mensagem;

      window.open(
        'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto),
        '_blank',
        'noopener'
      );

      if (status) status.textContent = 'Mensagem preparada no WhatsApp. É só apertar enviar.';
      form.reset();

      /* ----------------------------------------------------------------------
         ALTERNATIVA A — enviar por e-mail sem backend (abre o app de e-mail):
         substitua o window.open acima por:

         window.location.href =
           'mailto:' + CONFIG.email +
           '?subject=' + encodeURIComponent('Contato pelo site — ' + data.nome) +
           '&body=' + encodeURIComponent(texto);

         ----------------------------------------------------------------------
         ALTERNATIVA B — receber por e-mail de verdade, sem servidor próprio.
         Crie uma conta gratuita em formspree.io (ou basin/web3forms), pegue o
         endpoint e troque o bloco de envio por:

         fetch('https://formspree.io/f/SEU_ID', {
           method: 'POST',
           headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
           body: JSON.stringify(data)
         })
         .then(function (r) {
           if (!r.ok) throw new Error('Falha no envio');
           status.textContent = 'Mensagem enviada. Retorno em até 1 dia útil.';
           form.reset();
         })
         .catch(function () {
           status.textContent = 'Não foi possível enviar. Chame no WhatsApp: (11) 94594-8096';
         });

         ----------------------------------------------------------------------
         ALTERNATIVA C — backend próprio: troque a URL do fetch acima pelo seu
         endpoint (ex.: /api/contato) e trate a resposta da mesma forma.

         DICA: para medir conversões, dispare o evento aqui —
         Google Analytics:  gtag('event', 'generate_lead');
         Meta Pixel:        fbq('track', 'Lead');
         ---------------------------------------------------------------------- */
    });

    // limpa o erro do campo assim que o usuário começa a corrigir
    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('has-error')) {
        field.classList.remove('has-error');
        var slot = field.querySelector('.field__error');
        if (slot) slot.textContent = '';
      }
    });
  }


  /* ==========================================================================
     07. ANO NO RODAPÉ
     ========================================================================== */
  var anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = String(new Date().getFullYear());

})();
