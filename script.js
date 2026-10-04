const projects = [
  { name: "CodeFit", repo: "projeto-plp", category: "software", symbol: "λ", color: "#b9f227", description: "Sistema de gestão para academias com membros, pagamentos, equipamentos, horários e treinos.", tags: ["Haskell", "Funcional"] },
  { name: "PitsA", repo: "PitsA", category: "software", symbol: "P", color: "#ff9f6e", description: "Sistema de delivery para pizzaria com persistência em H2 e cobertura de testes automatizados.", tags: ["Java", "H2", "Testes"] },
  { name: "Mercado Pypreço", repo: "Projeto-Mercado-Pypreco", category: "dados", symbol: "Py", color: "#66d9ca", description: "Sistema de supermercado com banco de dados e controle completo de estoque.", tags: ["Python", "Banco de dados"] },
  { name: "CodeFit V2", repo: "projeto-plp-prolog", category: "software", symbol: "Pl", color: "#9e91ff", description: "Nova versão do sistema de academia explorando programação lógica e consultas inteligentes.", tags: ["Prolog", "Lógica"] },
  { name: "DocuMin", repo: "DocuMin", category: "software", symbol: "D", color: "#ffd767", description: "Criação e organização de documentos com diferentes visões e operações.", tags: ["Java", "Facade"] },
  { name: "MrBet", repo: "Projeto-MrBet", category: "software", symbol: "MB", color: "#ff7388", description: "Plataforma para gerenciamento de apostas e campeonatos esportivos.", tags: ["Java", "POO"] },
  { name: "Sistema Bancário", repo: "SISTEMA-BANCARIO-C", category: "software", symbol: "$", color: "#65d49e", description: "Operações bancárias no terminal: saque, depósito, extrato e investimentos.", tags: ["C", "Estruturas"] },
  { name: "Clínica Médica", repo: "Clinica-Medica-SQL", category: "dados", symbol: "+", color: "#79b8ff", description: "Modelagem e administração de dados para uma clínica médica.", tags: ["SQL", "Modelagem"] },
  { name: "Agente Inteligente", repo: "Criacao-de-agente-inteligente", category: "dados", symbol: "AI", color: "#c69cff", description: "Agente que toma decisões e navega por um ambiente 2D evitando obstáculos.", tags: ["Python", "IA"] },
  { name: "Google Clone", repo: "Google-Clone", category: "web", symbol: "G", color: "#ffcd64", description: "Recriação responsiva da interface inicial do Google para estudo de front-end.", tags: ["HTML", "CSS"] },
  { name: "Calculadora IMC", repo: "IMC-BMI", category: "web", symbol: "=", color: "#68ddd0", description: "Calculadora web de índice de massa corporal com retorno visual imediato.", tags: ["JavaScript", "CSS"] },
  { name: "Agenda de Contatos", repo: "AgendaDeContatos-Project", category: "software", symbol: "@", color: "#ff9f6e", description: "Agenda para cadastro, consulta e gerenciamento de contatos.", tags: ["Java", "POO"] }
];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const projectContainer = document.querySelector("[data-projects]");

function projectMarkup(project, index) {
  const url = `https://github.com/kevinicolasdev/${project.repo}`;
  return `
    <a class="project-card reveal" href="${url}" target="_blank" rel="noopener noreferrer" data-category="${project.category}" style="--project-color:${project.color};--delay:${Math.min(index % 3, 2) * 70}ms">
      <div class="project-top"><span class="project-number">${String(index + 1).padStart(2, "0")}</span><span class="project-arrow" aria-hidden="true">↗</span></div>
      <div class="project-visual" aria-hidden="true"><span class="project-symbol">${project.symbol}</span></div>
      <div><h3>${project.name}</h3><p class="project-description">${project.description}</p><div class="project-tags">${project.tags.map(tag => `<span>${tag}</span>`).join("")}</div></div>
    </a>`;
}

projectContainer.innerHTML = projects.map(projectMarkup).join("");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => {
  const delay = element.dataset.delay;
  if (delay) element.style.setProperty("--delay", `${delay}ms`);
  revealObserver.observe(element);
});

const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector("[data-back-to-top]");

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("is-scrolled", scrollTop > 30);
  backToTop.classList.toggle("is-visible", scrollTop > 700);
  progress.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const toggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");
function closeMenu() {
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menu");
  navList.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  toggle.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
  navList.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});
navList.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

const navLinks = [...document.querySelectorAll(".nav-list a")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });
document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));

const projectCards = [...document.querySelectorAll(".project-card")];
const previousProjects = document.querySelector("[data-project-prev]");
const nextProjects = document.querySelector("[data-project-next]");
const projectPage = document.querySelector("[data-project-page]");
const projectsPerPage = 6;
let activeProjectFilter = "todos";
let activeProjectPage = 0;

function updateProjects() {
  const filtered = projectCards.filter(card => activeProjectFilter === "todos" || card.dataset.category === activeProjectFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / projectsPerPage));
  activeProjectPage = Math.min(activeProjectPage, totalPages - 1);
  const pageStart = activeProjectPage * projectsPerPage;
  const visibleCards = new Set(filtered.slice(pageStart, pageStart + projectsPerPage));

  projectCards.forEach(card => {
    card.hidden = !visibleCards.has(card);
    card.classList.remove("page-enter");
    if (visibleCards.has(card)) {
      card.classList.add("is-visible");
      if (!reducedMotion) requestAnimationFrame(() => card.classList.add("page-enter"));
    }
  });

  projectPage.textContent = `${activeProjectPage + 1} / ${totalPages}`;
  previousProjects.disabled = activeProjectPage === 0;
  nextProjects.disabled = activeProjectPage >= totalPages - 1;
}

document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    activeProjectFilter = button.dataset.filter;
    activeProjectPage = 0;
    document.querySelectorAll(".filter-button").forEach(item => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    updateProjects();
  });
});

previousProjects.addEventListener("click", () => { activeProjectPage -= 1; updateProjects(); });
nextProjects.addEventListener("click", () => { activeProjectPage += 1; updateProjects(); });
updateProjects();

const typed = document.querySelector(".typed-text");
if (typed && !reducedMotion) {
  const words = typed.dataset.words.split(",");
  let wordIndex = 0;
  let charIndex = words[0].length;
  let deleting = true;
  const type = () => {
    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    typed.textContent = word.slice(0, charIndex);
    let delay = deleting ? 45 : 80;
    if (!deleting && charIndex === word.length) { deleting = true; delay = 1600; }
    if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 350; }
    window.setTimeout(type, delay);
  };
  window.setTimeout(type, 1400);
}

const copyButton = document.querySelector(".copy-email");
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.email);
    copyButton.classList.add("is-copied");
    copyButton.querySelector(".copy-label").textContent = "E-mail copiado!";
    window.setTimeout(() => {
      copyButton.classList.remove("is-copied");
      copyButton.querySelector(".copy-label").textContent = "Copiar e-mail";
    }, 2000);
  } catch {
    window.location.href = `mailto:${copyButton.dataset.email}`;
  }
});

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.style.opacity = "1";
  }, { passive: true });

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${y * -4}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
