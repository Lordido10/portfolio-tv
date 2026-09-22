const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* boot */
async function runBoot() {
  const boot = document.getElementById("boot");
  const status = document.getElementById("bootStatus");
  const bars = [...document.querySelectorAll(".boot__meter i")];
  if (!boot) return document.body.classList.remove("is-loading");
  if (reducedMotion) {
    boot.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    return;
  }
  for (const bar of bars) { await wait(95); bar.classList.add("on"); }
  await wait(100);
  status.textContent = "SIGNAL FOUND // CH 01";
  await wait(280);
  boot.classList.add("power");
  await wait(430);
  boot.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
}
window.addEventListener("load", runBoot);

/* reveal */
const revealItems = [...document.querySelectorAll(".reveal")];
if (reducedMotion) revealItems.forEach((el) => el.classList.add("is-visible"));
else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  revealItems.forEach((el) => io.observe(el));
}

/* channel transition: ~300 ms perceived */
async function tune(frame, overlay, labelEl, label, swapFn) {
  if (reducedMotion) { swapFn(); return; }
  frame?.classList.add("is-distorting");
  await wait(55);
  if (labelEl) labelEl.textContent = label;
  overlay?.classList.add("is-active");
  await wait(95);
  swapFn();
  await wait(75);
  overlay?.classList.add("is-flashing");
  await wait(75);
  overlay?.classList.remove("is-active", "is-flashing");
  frame?.classList.remove("is-distorting");
}

const experiences = [
  { title:"CODEAVOUR 7.0<br>INTERNATIONAL", role:"EVENT LOGISTICS VOLUNTEER", year:"2026", image:"assets/experience-01.jpeg", description:"Volunteered during Codeavour 7.0 International in Jakarta, supporting logistics and operational needs for an international robotics event. Assisted with equipment preparation, venue setup, and on-site coordination to help ensure smooth event execution." },
  { title:"LDKCP<br>2026", role:"LOGISTICS COORDINATOR", year:"2026", image:"assets/experience-02.jpg", description:"Coordinated the logistics team in preparing, managing, and distributing equipment and materials so operational needs were ready before and throughout the event." },
  { title:"TECHNO<br>2025", role:"LOGISTICS COMMITTEE", year:"2025", image:"assets/experience-03.jpg", description:"Assisted in preparing and organizing event equipment and logistical needs while coordinating with team members to ensure materials remained available throughout the event." },
  { title:"SESVENT<br>2025", role:"LOGISTICS COMMITTEE", year:"2025", image:"assets/experience-04.JPG", description:"Supported on-site logistics and coordinated equipment setups for student engagement activities, helping create a smooth experience for participants." }
];
let experienceIndex = 0;
let experienceBusy = false;
const experienceEls = {
  frame: document.getElementById("experienceFrame"),
  image: document.getElementById("experienceImage"),
  counter: document.getElementById("experienceCounter"),
  year: document.getElementById("experienceYear"),
  role: document.getElementById("experienceRole"),
  title: document.getElementById("experienceTitle"),
  description: document.getElementById("experienceDescription"),
  overlay: document.getElementById("experienceTune"),
  label: document.getElementById("experienceTuneLabel")
};
const experienceButtons = [...document.querySelectorAll(".experience-channel")];
async function changeExperience(index) {
  if (experienceBusy) return;
  index = (index + experiences.length) % experiences.length;
  if (index === experienceIndex) return;
  experienceBusy = true;
  const item = experiences[index];
  await tune(experienceEls.frame, experienceEls.overlay, experienceEls.label, `CH ${String(index+1).padStart(2,"0")}`, () => {
    experienceEls.image.src = item.image;
    experienceEls.image.alt = item.title.replace(/<br>/g," ");
    experienceEls.counter.textContent = `${String(index+1).padStart(2,"0")} / 04`;
    experienceEls.year.textContent = item.year;
    experienceEls.role.textContent = item.role;
    experienceEls.title.innerHTML = item.title;
    experienceEls.description.textContent = item.description;
    experienceButtons.forEach((b,i) => b.classList.toggle("is-active", i===index));
    experienceIndex = index;
  });
  experienceBusy = false;
}
experienceButtons.forEach((b) => b.addEventListener("click", () => changeExperience(Number(b.dataset.index))));
document.getElementById("experiencePrev")?.addEventListener("click", () => changeExperience(experienceIndex-1));
document.getElementById("experienceNext")?.addEventListener("click", () => changeExperience(experienceIndex+1));

const projects = [
  {
    channel:"04.1", number:"01", title:"LEAFLENS", category:"COMPUTER VISION / MACHINE LEARNING", kind:"image", image:"assets/project-leaf.png",
    summary:"An explainable screening system that extracts measurable visual features from leaf images and evaluates ensemble models across six crop conditions.",
    description:"LeafLens is an explainable plant-screening system built around measurable visual information extracted from leaf imagery. It combines computer-vision feature extraction with ensemble machine-learning approaches and presents the result through a practical screening interface.",
    highlights:["Visual feature extraction from leaf imagery","Ensemble model evaluation","Screening across six crop conditions"],
    tech:["Python","OpenCV","Scikit-learn","XGBoost","Streamlit","Flask","Computer Vision"],
    github:"https://github.com/LecyLecy/plant-leaf-disease-classifier", status:"LIVE PROJECT"
  },
  {
    channel:"04.2", number:"02", title:"RADIA", category:"AI-ASSISTED CLINICAL WORKFLOW", kind:"image", image:"assets/project-scan.png",
    summary:"A role-based clinical workflow integrating chest X-ray screening, physician review, and secure report delivery into a human-centered application.",
    description:"RADIA combines chest X-ray AI screening with a role-based clinical workflow for physician review and secure report delivery. The emphasis is on integrating model inference into a human-centered process rather than presenting AI predictions as a standalone endpoint.",
    highlights:["Chest X-ray AI screening","Role-based physician review","Secure report delivery workflow"],
    tech:["Python","PyTorch","Torchvision","FastAPI","React","Supabase","Docker"],
    github:"https://github.com/LecyLecy/radia-xray-ai-screening", status:"LIVE PROJECT"
  },
  {
    channel:"04.3", number:"03", title:"PORTFOLIO TV", category:"PERSONAL PORTFOLIO WEBSITE", kind:"image", image:"assets/project-portfolio.png",
    summary:"The website you are viewing: a personal broadcast portfolio built around retro television, editorial composition, and channel-switch interactions.",
    description:"Portfolio TV is this portfolio experience. It combines responsive frontend development, custom CSS illustration, accessible interactions, CRT-inspired channel transitions, and an original visual language influenced by retro broadcast interfaces.",
    highlights:["Responsive editorial layout","Custom CRT and tuning interactions","Original project-channel system"],
    tech:["HTML","CSS","JavaScript","Responsive Design","Interaction Design"],
    github:"https://github.com/Lordido10/portfolio-tv", status:"CURRENT PORTFOLIO"
  },
  {
    channel:"04.4", number:"04", title:"SPENDLY", category:"UNDER DEVELOPMENT", kind:"upcoming", image:null,
    summary:"Spendly is currently under development. This channel is reserved while the product direction, interface, and public release are still being built.",
    description:"Spendly is currently under development. This no-signal channel acts as a placeholder while the product, screenshots, and public repository are still being prepared.",
    highlights:["Under development","Product and interface in progress","Details will be revealed when ready"],
    tech:["IN DEVELOPMENT"],
    github:null, status:"UNDER DEVELOPMENT / NO SIGNAL"
  }
];
let projectIndex = 0;
let projectBusy = false;
const projectCards = [...document.querySelectorAll(".program-card")];
const projectEls = {
  channel: document.getElementById("projectChannel"), title: document.getElementById("projectTitle"), category: document.getElementById("projectCategory"), summary: document.getElementById("projectSummary"),
  tv: document.getElementById("projectTv"), visual: document.getElementById("projectVisual"), content: document.getElementById("projectVisualContent"), overlay: document.getElementById("projectTune"), label: document.getElementById("projectTuneLabel")
};
function projectVisualHTML(item, forModal=false) {
  if (item.image) return `<img src="${item.image}" alt="${item.title} project screenshot" />${forModal ? "" : '<div class="scanlines"></div>'}`;
  return `<div class="project-visual--upcoming"><div class="no-signal"><strong>NO SIGNAL</strong><span>SPENDLY / UNDER DEVELOPMENT</span></div></div>`;
}
function renderProjectVisual(item) {
  projectEls.content.innerHTML = `${projectVisualHTML(item)}<div class="project-tv__hover"><small>CH ${item.channel}</small><strong>${item.title}</strong><span>${item.kind === "upcoming" ? "UNDER DEVELOPMENT" : "WATCH PROGRAM ↗"}</span></div>`;
}
async function changeProject(index) {
  if (projectBusy) return;
  index = (index + projects.length) % projects.length;
  if (index === projectIndex) return;
  projectBusy = true;
  const item = projects[index];
  await tune(projectEls.tv, projectEls.overlay, projectEls.label, `CH ${item.channel}`, () => {
    projectEls.channel.textContent = `CH ${item.channel} / PROGRAM ${item.number}`;
    projectEls.title.textContent = item.title;
    projectEls.category.textContent = item.category;
    projectEls.summary.textContent = item.summary;
    renderProjectVisual(item);
    projectCards.forEach((c,i) => c.classList.toggle("is-active", i===index));
    projectIndex = index;
  });
  projectBusy = false;
}
projectCards.forEach((card) => card.addEventListener("click", () => { const index = Number(card.dataset.index); if (index === projectIndex) openProjectModal(); else changeProject(index); }));

/* modal */
const modal = document.getElementById("projectModal");
const modalStatic = document.getElementById("modalStatic");
const modalEls = {
  channel:document.getElementById("modalChannel"), visual:document.getElementById("modalVisual"), category:document.getElementById("modalCategory"), title:document.getElementById("modalTitle"), description:document.getElementById("modalDescription"), highlights:document.getElementById("modalHighlights"), tech:document.getElementById("modalTech"), github:document.getElementById("modalGithub"), status:document.getElementById("modalStatus")
};
async function openProjectModal() {
  const item = projects[projectIndex];
  modalEls.channel.textContent = `CH ${item.channel} / PROJECT BROADCAST`;
  modalEls.visual.innerHTML = projectVisualHTML(item,true);
  modalEls.category.textContent = item.category;
  modalEls.title.textContent = item.title;
  modalEls.description.textContent = item.description;
  modalEls.highlights.innerHTML = item.highlights.map((h)=>`<span>${h}</span>`).join("");
  modalEls.tech.innerHTML = item.tech.map((t)=>`<span>${t}</span>`).join("");
  modalEls.status.textContent = item.status;
  if (item.github) { modalEls.github.href = item.github; modalEls.github.hidden = false; }
  else { modalEls.github.hidden = true; }
  modal.classList.add("is-open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("modal-open");
  if (!reducedMotion) { modalStatic.classList.add("is-active"); await wait(285); modalStatic.classList.remove("is-active"); }
}
function closeProjectModal(){ modal.classList.remove("is-open"); modal.setAttribute("aria-hidden","true"); document.body.classList.remove("modal-open"); }
document.getElementById("projectOpen")?.addEventListener("click", openProjectModal);
projectEls.tv?.addEventListener("click", openProjectModal);
projectEls.tv?.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){e.preventDefault();openProjectModal();}});
document.getElementById("modalClose")?.addEventListener("click", closeProjectModal);
modal?.addEventListener("click", (e)=>{if(e.target===modal) closeProjectModal();});
document.addEventListener("keydown", (e)=>{if(e.key==="Escape"&&modal?.classList.contains("is-open")) closeProjectModal();});

/* nav */
const sections = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-item")];
function updateNav(){let current="home";sections.forEach((s)=>{if(window.scrollY>=s.offsetTop-230)current=s.id});navItems.forEach((n)=>n.classList.toggle("is-active",n.dataset.section===current));}
window.addEventListener("scroll", updateNav,{passive:true});updateNav();
navItems.forEach((n)=>n.addEventListener("click",(e)=>{const t=document.querySelector(n.getAttribute("href"));if(!t)return;e.preventDefault();t.scrollIntoView({behavior:reducedMotion?"auto":"smooth",block:"start"});}));

document.getElementById("year").textContent = new Date().getFullYear();

/* subtle hero CRT interference */
const heroNoise = document.querySelector(".tv__noise");
function randomInterference(){if(reducedMotion||!heroNoise)return;setTimeout(()=>{heroNoise.animate([{opacity:.075},{opacity:.25},{opacity:.035},{opacity:.14},{opacity:.075}],{duration:140,easing:"linear"});randomInterference();},2800+Math.random()*4800)}
randomInterference();
