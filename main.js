const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d } catch { return d } }, set(k, v) { localStorage.setItem(k, JSON.stringify(v)) } };
const BASE = [
  { id: 'robo', title: 'O Robô Curioso', emoji: '🤖', bg: '#b5deff', card: 'blue-card', stars: 4, tag: 'Aventura', btn: '#f07b20' },
  { id: 'bosque', title: 'O Bosque Secreto', emoji: '🌳', bg: '#b4ebb4', card: 'green-card', stars: 5, tag: 'Fantasia', btn: '#ff5eae' },
  { id: 'maquina', title: 'A Máquina do Tempo', emoji: '⚙️', bg: '#ffd3b0', card: 'peach-card', stars: 3, tag: 'Mistério', btn: '#8a5fc0' },
  { id: 'chapeu', title: 'Chapéuzinho Vermelho', emoji: '🧺', bg: '#d8f5c8', stars: 4, tag: 'Fantasia' },
  { id: 'espaco', title: 'Aventura no Espaço', emoji: '🚀', bg: '#1a1f5c', stars: 5, tag: 'Aventura' },
  { id: 'amigos', title: 'Os Amigos da Praça', emoji: '🧒', bg: '#ffe0f0', stars: 4, tag: 'Amizade' }];
const ROBO = { chapter: 'Capitulo 1: O Som do Orvalho', p: ['Era uma vez um robô pequeno e muito gentil chamado B-01. Ele era feito de metal cor de ferrugem, tinha olhos que brilhavam como lâmpadas azuis e fazia um barulhinho engraçado quando andava: clinc, nhéc, clinc!', 'B-01 estava no meio de uma floresta gigante e muito, muito verde. Ele olhava para os lados e só via árvores gigantes que pareciam encostar no céu.'], q: 'O que B-01 deve fazer?', choices: ['Seguir pelo caminho de flores cintilantes', 'Entrar no tronco oco de uma árvore gigante'], out: [['Ele percebeu que, embora não soubesse o caminho de volta, o caminho para a frente estava cheio de cores que ele nunca tinha visto. Então seguiu pelo caminho repleto de flores.', 'A floresta parecia sussurrar um segredo através do vento nas folhas.', '"A aventura está chamando!", pensou o robozinho.'], ['Dentro do tronco, B-01 encontrou uma escada em espiral que descia, descia... e acendia luzinhas a cada degrau.', 'No fundo havia uma porta pequenina com o mesmo desenho do seu peito.', '"Será que eu pertenço a este lugar?", pensou o robozinho.']] };
const custom = () => store.get('custom', []);
const all = () => [...custom(), ...BASE];
const find = id => all().find(s => s.id === id);
const prog = () => store.get('progress', {});
const user = () => store.get('user', null);
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = m; document.body.append(t); setTimeout(() => t.remove(), 2400) }
function go(u, d = 0) { setTimeout(() => location.href = u, d) }
const page = document.body.dataset.page;
if (!['index', 'login'].includes(page) && !user()) location.replace('index.html');
if (document.body.dataset.nav) {
  const items = [['home', 'home.html', '🏠', 'Início'], ['library', 'library.html', '📖', 'Biblioteca'], ['evolution', 'evolution.html', '🗺️', 'Evolução'], ['profile', 'profile.html', '👤', 'Perfil']];
  const n = document.createElement('nav'); n.className = 'nav'; n.setAttribute('aria-label', 'Principal');
  n.innerHTML = items.map(i => `<a href="${i[1]}" class="${i[0] === page ? 'on' : ''}" ${i[0] === page ? 'aria-current="page"' : ''}><span>${i[2]}</span>${i[3]}</a>`).join(''); document.body.append(n)
}
function field(el, msg) { el.classList.add('invalid'); let e = el.nextElementSibling; if (!e || !e.classList.contains('err')) { e = document.createElement('p'); e.className = 'err'; el.after(e) } e.textContent = msg }
function clear(f) { $$('.invalid', f).forEach(x => x.classList.remove('invalid')); $$('.err', f).forEach(x => x.remove()) }
const mail = v => /^\S+@\S+\.\S+$/.test(v);
const R = {
  index() {
    const f = $('#form'), r = $('#age'), o = $('#ageOut'); r.oninput = () => o.textContent = r.value + ' anos'; r.oninput();
    f.onsubmit = e => {
      e.preventDefault(); clear(f); let ok = true;
      if ($('#name').value.trim().length < 2) { field($('#name'), 'Digite seu nome.'); ok = false }
      if (!mail($('#email').value)) { field($('#email'), 'Digite um e-mail válido.'); ok = false }
      if ($('#pass').value.length < 6) { field($('#pass'), 'A senha precisa de 6 ou mais caracteres.'); ok = false }
      if (!ok) return; store.set('user', { name: $('#name').value.trim(), email: $('#email').value.trim(), pass: $('#pass').value, age: +r.value }); toast('Conta criada!'); go('home.html', 700)
    }
  },
  login() {
    const f = $('#form'); f.onsubmit = e => {
      e.preventDefault(); clear(f); const u = store.get('user', null);
      if (!u) return field($('#email'), 'Nenhuma conta neste navegador. Crie uma conta primeiro.');
      if ($('#email').value.trim() !== u.email) return field($('#email'), 'E-mail não encontrado.');
      if ($('#pass').value !== u.pass) return field($('#pass'), 'Senha incorreta.'); toast('Bem-vindo de volta!'); go('home.html', 500)
    }
  },
  home() {
    const u = user(), p = prog(); $('#hello').textContent = `Olá, ${u.name.split(' ')[0]}! 👋`;
    const mine = all().filter(s => p[s.id] !== undefined); const rec = all().filter(s => p[s.id] === undefined);
    $('#mine').innerHTML = mine.length ? mine.map(s => `<article class="card" style="background:${s.bg}"><div class="pic" style="background:#fff8">${s.emoji}</div><h3>${s.title}</h3><div class="stars" aria-label="${s.stars} estrelas">${stars(s.stars)}</div><p>Progresso: ${p[s.id]}%</p><a class="pill" style="background:${s.btn || '#f07b20'}" href="story.html?id=${s.id}">${p[s.id] >= 100 ? 'Reler' : 'Continuar'}</a></article>`).join('') : '<p class="empty">Você ainda não começou nenhuma história. Toque em Gerar história nova!</p>';
    $('#rec').innerHTML = rec.map(s => `<article class="card rec"><div class="pic" style="background:${s.bg}">${s.emoji}</div><h3>${s.title}</h3><div class="stars">${stars(s.stars)}</div><a class="pill" style="background:#ff5a5f" href="story.html?id=${s.id}">Iniciar</a></article>`).join('')
  },
  create() {
    const sel = {}; $$('.tiles').forEach((g, i) => { $$('.tile', g).forEach(t => t.onclick = () => { $$('.tile', g).forEach(x => x.setAttribute('aria-pressed', 'false')); t.setAttribute('aria-pressed', 'true'); sel[i] = t.dataset.v; $$('.gen .field')[i].value = '' }) });
    $$('.gen .field').forEach((f, i) => f.oninput = () => { if (f.value) { sel[i] = f.value; $$('.tile', $$('.tiles')[i]).forEach(x => x.setAttribute('aria-pressed', 'false')) } });
    let diff = 'Média'; $$('.diff').forEach(d => d.onclick = () => { $$('.diff').forEach(x => x.setAttribute('aria-pressed', 'false')); d.setAttribute('aria-pressed', 'true'); diff = d.dataset.v });
    $('#gen').onclick = () => {
      if ([0, 1, 2].some(i => !sel[i])) return toast('Escolha as 3 opções ou digite em "Outro..."');
      $('#wizard').hidden = true; $('#loading').hidden = false;
      setTimeout(() => {
        const id = 'c' + Date.now(), long = diff !== 'Fácil';
        const text = [`Era uma vez uma história de ${sel[0]}, e tudo começou em ${sel[1]}.`, `${sel[2]} acordou cedo, sentiu o coração bater forte e soube que aquele dia seria diferente.`];
        if (long) text.push(`Entre sons e cores que nunca tinha visto, ${sel[2]} percebeu que cada passo escondia uma pista nova.`);
        if (diff === 'Difícil') text.push('Com paciência e atenção aos detalhes, uma decisão importante surgiu no horizonte.');
        const s = { id, title: `${sel[2]} em ${sel[1]}`, emoji: '✨', bg: '#e8c6ff', stars: 5, tag: sel[0], btn: '#7b52f0', custom: { p: text } };
        store.set('custom', [s, ...custom()]); go('story.html?id=' + id)
      }, 1800)
    }
  },
  story() {
    const id = new URLSearchParams(location.search).get('id'), s = find(id);
    if (!s) { $('#reader').innerHTML = '<p class="empty">História não encontrada.</p><a class="btn" href="library.html">Ir para a biblioteca</a>'; return }
    const d = id === 'robo' ? ROBO : s.custom ? { chapter: 'Capítulo 1', p: s.custom.p, q: 'O que acontece agora?', choices: ['Continuar a aventura', 'Respirar fundo e pensar'], out: [['Com coragem, a história seguiu em frente e novas surpresas apareceram.'], ['Depois de pensar, a decisão ficou clara e tudo deu certo.']] } : { chapter: 'Capítulo 1', p: [`${s.title} começa com um dia comum que logo vira extraordinário.`, 'Havia sons novos no ar e pistas escondidas por todo lado.'], q: 'Qual caminho seguir?', choices: ['Seguir a pista brilhante', 'Perguntar a um amigo'], out: [['A pista levou a um lugar surpreendente, cheio de cores.'], ['O amigo sorriu e mostrou um atalho secreto.']] };
    $('#title').textContent = s.title; $('#chap').textContent = d.chapter; $('#scene').textContent = s.emoji;
    const pr = prog(); if (pr[id] === undefined) { pr[id] = 50; store.set('progress', pr) }
    const para = t => `<p class="para">${t}</p>`;
    $('#text').innerHTML = d.p.map(para).join(''); $('#q').textContent = d.q;
    $('#choices').innerHTML = d.choices.map((c, i) => `<button class="choice c${i + 1}" data-i="${i}">${c}</button>`).join('');
    $$('.choice').forEach(b => b.onclick = () => {
      $$('.choice').forEach(x => { x.disabled = true }); b.classList.add('picked');
      $('#after').innerHTML = d.out[b.dataset.i].map(para).join('') + '<button class="btn green" id="fin">Finalizar</button>';
      $('#fin').onclick = () => { const p = prog(); p[id] = 100; store.set('progress', p); toast('História finalizada!'); go('home.html', 700) };
      $('#after').scrollIntoView({ behavior: 'smooth' })
    });
    let fs = +store.get('fs', 1.1); const ap = () => document.body.style.setProperty('--fs', fs + 'rem'); ap();
    $('#aminus').onclick = () => { fs = Math.max(.9, fs - .15); store.set('fs', fs); ap() }; $('#aplus').onclick = () => { fs = Math.min(1.8, fs + .15); store.set('fs', fs); ap() }
  },
  library() {
    const p = prog(); let tag = 'Todas', q = ''; const tags = ['Todas', ...new Set(all().map(s => s.tag))];
    $('#chips').innerHTML = tags.map(t => `<button class="chip" aria-pressed="${t === tag}">${t}</button>`).join('');
    const draw = () => {
      const l = all().filter(s => (tag === 'Todas' || s.tag === tag) && s.title.toLowerCase().includes(q));
      $('#list').innerHTML = l.length ? l.map(s => `<a class="card rec" href="story.html?id=${s.id}"><div class="pic" style="background:${s.bg}">${s.emoji}</div><h3>${s.title}</h3><div class="stars">${stars(s.stars)}</div><p>${p[s.id] !== undefined ? p[s.id] + '% lido' : s.tag}</p></a>`).join('') : '<p class="empty" style="grid-column:1/-1">Nada encontrado. Tente outra busca ou gere uma história nova.</p>'
    };
    $$('.chip').forEach(c => c.onclick = () => { tag = c.textContent; $$('.chip').forEach(x => x.setAttribute('aria-pressed', x === c)); draw() });
    $('#q').oninput = e => { q = e.target.value.toLowerCase(); draw() }; draw()
  },
  evolution() {
    const p = prog(), v = Object.values(p), done = v.filter(x => x >= 100).length;
    $('#started').textContent = v.length; $('#done').textContent = done;
    const avg = v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0; $('#avg').style.width = avg + '%'; $('#avgt').textContent = avg + '%';
    const bs = [['🌱', 'Primeira história', v.length >= 1], ['📚', '3 histórias lidas', done >= 3], ['✨', 'Criou uma história', custom().length >= 1], ['🏆', 'Leitor dedicado', done >= 5]];
    $('#badges').innerHTML = bs.map(b => `<div class="badge ${b[2] ? '' : 'off'}">${b[0]} ${b[1]}</div>`).join('')
  },
  profile() {
    const u = user(); $('#pname').value = u.name; $('#pmail').value = u.email; $('#page').value = u.age;
    $('#pf').onsubmit = e => {
      e.preventDefault(); clear($('#pf')); if ($('#pname').value.trim().length < 2) return field($('#pname'), 'Digite seu nome.');
      if (!mail($('#pmail').value)) return field($('#pmail'), 'Digite um e-mail válido.');
      store.set('user', { ...u, name: $('#pname').value.trim(), email: $('#pmail').value.trim(), age: +$('#page').value }); toast('Alterações salvas')
    };
    const dlg = $('#dlg'); $('#reset').onclick = () => dlg.showModal(); $('#no').onclick = () => dlg.close();
    $('#yes').onclick = () => { store.set('progress', {}); store.set('custom', []); dlg.close(); toast('Progresso apagado') };
    $('#out').onclick = () => { localStorage.removeItem('user'); location.href = 'login.html' }
  }
};
R[page] && R[page]();
