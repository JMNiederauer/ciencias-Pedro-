// ---------- DOM ----------
const texto = document.getElementById('texto');
const opcoes = document.getElementById('opcoes');
const img = document.getElementById('imagem-cena');

// ---------- Bases de imagem (SEM extensão) ----------
const BASE = {
  membrana:   'assets/imagens/01_membrana',
  tipos:      'assets/imagens/02_procarionte_vs_eucarionte',
  animal:     'assets/imagens/03_eucarionte_animal',
  vegetal:    'assets/imagens/04_eucarionte_vegetal',
  niveis:     'assets/imagens/05_niveis_organizacao',
  tecidos:    'assets/imagens/06_tecidos'
};

// ---------- Utilitários ----------
function candidatosPorExtensao(baseSemExt, exts = ['png','jpg','jpeg','svg','webp']) {
  return exts.map(ext => `${baseSemExt}.${ext}`);
}

function tentarCarregarSequencial(urls) {
  return new Promise(resolve => {
    let i = 0;
    const tentativa = () => {
      if (i >= urls.length) return resolve(null);
      const url = urls[i++] + '?v=' + Date.now(); // evita cache
      const im = new Image();
      im.onload = () => resolve(url);
      im.onerror = tentativa;
      im.src = url;
    };
    tentativa();
  });
}

/**
 * Carrega a imagem pela chave do capítulo.
 * Retorna true se carregou, false se falhou (e já mostra UI de erro com diagnóstico).
 */
async function carregarImagem(chave) {
  const base = BASE[chave];
  if (!base) {
    mostrarErro(`Chave de imagem desconhecida: ${chave}`);
    return false;
  }
  const candidatos = candidatosPorExtensao(base);
  const achou = await tentarCarregarSequencial(candidatos);
  if (achou) {
    img.src = achou;
    img.classList.remove('hidden');
    return true;
  } else {
    img.classList.add('hidden');
    // UI de erro + diagnóstico
    texto.innerHTML =
`⚠️ Não consegui carregar a imagem deste capítulo.

Arquivos testados:
${candidatos.join('\n')}

Dicas:
• Confirme o nome e a extensão em assets/imagens/
• Teste abrindo cada URL direto no navegador (toque nos botões abaixo)`;
    opcoes.innerHTML = '';
    candidatos.forEach(c => {
      const b = document.createElement('button');
      b.textContent = `Abrir: ${c.split('/').pop()}`;
      b.onclick = () => window.open(c, '_blank');
      opcoes.appendChild(b);
    });
    const voltar = document.createElement('button');
    voltar.textContent = 'Voltar para Tipos de Células';
    voltar.onclick = cap2;
    opcoes.appendChild(voltar);
    opcoes.classList.remove('hidden');
    return false;
  }
}

function mostrarErro(msg) {
  img.classList.add('hidden');
  texto.textContent = `⚠️ ${msg}`;
  opcoes.innerHTML = '';
  const back = document.createElement('button');
  back.textContent = 'Voltar ao início';
  back.onclick = iniciar;
  opcoes.appendChild(back);
  opcoes.classList.remove('hidden');
}

function digitarTexto(t, vel = 24, done) {
  let i = 0;
  texto.innerHTML = "";
  opcoes.classList.add('hidden');
  (function escrever() {
    if (i < t.length) {
      texto.innerHTML += t.charAt(i++);
      setTimeout(escrever, vel);
    } else {
      if (done) setTimeout(done, 220);
    }
  })();
}

function botoes(lista) {
  opcoes.innerHTML = "";
  lista.forEach(({ texto, acao }) => {
    const b = document.createElement('button');
    b.textContent = texto;
    b.onclick = acao;
    opcoes.appendChild(b);
  });
  opcoes.classList.remove('hidden');
}

// ---------- Fluxo (somente conteúdo do material) ----------
function iniciar() {
  digitarTexto(
`🔐 BEM-VINDO!

Este jogo cobre exatamente o conteúdo do material:
1) Membrana plasmática
2) Procarionte × Eucarionte
3) Célula eucarionte ANIMAL
4) Célula eucarionte VEGETAL
5) Níveis de organização
6) Tecidos`,
    24,
    () => botoes([{ texto: "Começar", acao: cap1 }])
  );
}

/* --------- CAP.1 Membrana --------- */
async function cap1() {
  const ok = await carregarImagem('membrana');
  if (!ok) return; // não segue se a imagem falhou
  digitarTexto(
`🧩 CAPÍTULO 1 — MEMBRANA PLASMÁTICA

A membrana plasmática contorna a célula e controla a ENTRADA/SAÍDA de substâncias (permeabilidade seletiva).`,
    24,
    () => botoes([{ texto: "Tipos de células", acao: cap2 }])
  );
}

/* --------- CAP.2 Tipos --------- */
async function cap2() {
  const ok = await carregarImagem('tipos');
  if (!ok) return;
  digitarTexto(
`🧩 CAPÍTULO 2 — TIPOS DE CÉLULAS

• PROCARIONTE: não possui núcleo delimitado; DNA no citoplasma; membrana plasmática; pode ter parede celular; ribossomos.
• EUCARIONTE: possui núcleo delimitado (carioteca) e várias organelas membranosas.

Escolha para LER sobre cada célula eucarionte:`,
    24,
    () => botoes([
      { texto: "CÉLULA EUCARIONTE ANIMAL", acao: cap3 },
      { texto: "CÉLULA EUCARIONTE VEGETAL", acao: cap4 },
      { texto: "Avançar: Níveis de organização", acao: cap5 }
    ])
  );
}

/* --------- CAP.3 Animal --------- */
async function cap3() {
  const ok = await carregarImagem('animal');
  if (!ok) return;
  digitarTexto(
`🧩 CAPÍTULO 3 — CÉLULA EUCARIONTE ANIMAL

Principais itens do material:
• Membrana plasmática (delimita a célula), citosol
• Núcleo: carioteca e nucléolo
• R.E. liso (lipídios) e R.E. rugoso (com ribossomos; proteínas)
• Ribossomos (síntese de proteínas)
• Mitocôndrias (geração de energia)
• Complexo golgiense (secreção/empacotamento)
• Lisossomos (digestão intracelular)
• Centríolos (cílios/flagelos)`,
    24,
    () => botoes([
      { texto: "Ver CÉLULA EUCARIONTE VEGETAL", acao: cap4 },
      { texto: "Voltar para TIPOS DE CÉLULAS", acao: cap2 },
      { texto: "Ir para Níveis de organização", acao: cap5 }
    ])
  );
}

/* --------- CAP.4 Vegetal --------- */
async function cap4() {
  const ok = await carregarImagem('vegetal');
  if (!ok) return;
  digitarTexto(
`🧩 CAPÍTULO 4 — CÉLULA EUCARIONTE VEGETAL

Semelhanças com a animal (membrana, citosol, ribossomos, R.E., mitocôndrias, complexo golgiense, núcleo).
Destaques específicos:
• Parede celular (celulósica)
• Vacúolos (armazenamento, principalmente água)
• Cloroplastos (fotossíntese → glicose)`,
    24,
    () => botoes([
      { texto: "Ver CÉLULA EUCARIONTE ANIMAL", acao: cap3 },
      { texto: "Voltar para TIPOS DE CÉLULAS", acao: cap2 },
      { texto: "Ir para Níveis de organização", acao: cap5 }
    ])
  );
}

/* --------- CAP.5 Níveis --------- */
async function cap5() {
  const ok = await carregarImagem('niveis');
  if (!ok) return;
  digitarTexto(
`🧩 CAPÍTULO 5 — NÍVEIS DE ORGANIZAÇÃO

Célula → Tecido → Órgão → Sistema → Organismo.`,
    24,
    () => botoes([
      { texto: "Tecidos", acao: cap6 },
      { texto: "Voltar aos Tipos de células", acao: cap2 }
    ])
  );
}

/* --------- CAP.6 Tecidos --------- */
async function cap6() {
  const ok = await carregarImagem('tecidos');
  if (!ok) return;
  digitarTexto(
`🧩 CAPÍTULO 6 — TECIDOS (Animal)

• Epitelial: revestimento/barreira
• Conjuntivo: conexão/sustentação/defesa/preenchimento/transporte (inclui SANGUE)
• Muscular: contração (voluntária ou não)
• Nervoso: impulsos; interpretação e armazenamento de informações`,
    24,
    () => botoes([
      { texto: "Voltar ao início", acao: iniciar },
      { texto: "Voltar aos Tipos de células", acao: cap2 }
    ])
  );
}

// ---------- Start ----------
iniciar();

