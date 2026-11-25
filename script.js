const GITHUB_USER = "vinhh78";

const PROJECT_METADATA = {
  "vinh-driver-thaibinh": {
    title: "VINH DRIVER - Thái Bình 3D",
    descVi: "Game 3D mô phỏng lái xe ShopeeFood tại Thành Phố Thái Bình xây dựng bằng Three.js.",
    descEn: "3D ShopeeFood delivery driving simulator set in Thai Binh City, built with Three.js.",
    tags: ["game 3d", "three.js", "web"],
    category: "web",
    icon: "fa-solid fa-motorcycle",
    accent: "linear-gradient(135deg, #f97316, #ea580c)",
    liveUrl: "https://vinh-driver-thaibinh.netlify.app/",
    htmlUrl: "",
    language: "Three.js / JS",
    langColor: "#f1e05a"
  },
  locket: {
    title: "dembevinh Locket Uploader",
    descVi: "Ứng dụng web đăng ảnh và video (tối đa 30s) lên Locket Camera không cần Locket Gold.",
    descEn: "Web app to upload photos and up to 30s videos to Locket Camera without Locket Gold.",
    tags: ["web", "python", "flask"],
    category: "python",
    icon: "fa-solid fa-camera-retro",
    accent: "linear-gradient(135deg, #f59e0b, #d97706)",
    liveUrl: "https://dembevinh-locket.onrender.com",
    language: "Python / HTML",
    langColor: "#3572A5"
  },
  "thuchanh-wordpress": {
    title: "WordPress Practice",
    descVi: "Website building and customization practice with WordPress and PHP.",
    descEn: "Website building and customization practice with WordPress and PHP.",
    tags: ["php", "wordpress"],
    category: "php",
    icon: "fa-brands fa-wordpress",
    accent: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    liveUrl: "",
    language: "PHP",
    langColor: "#4F5D95"
  },
  "tra-da": {
    title: "Tra Da Web",
    descVi: "Static web interface project crafted with HTML, CSS and JavaScript.",
    descEn: "Static web interface project crafted with HTML, CSS and JavaScript.",
    tags: ["web", "html"],
    category: "web",
    icon: "fa-solid fa-mug-hot",
    accent: "linear-gradient(135deg, #10b981, #047857)",
    liveUrl: "",
    language: "HTML",
    langColor: "#e34c26"
  },
  qr: {
    title: "QR Code Tool",
    descVi: "Lightweight browser utility for generating and displaying QR codes.",
    descEn: "Lightweight browser utility for generating and displaying QR codes.",
    tags: ["web", "utility"],
    category: "web",
    icon: "fa-solid fa-qrcode",
    accent: "linear-gradient(135deg, #6366f1, #4338ca)",
    liveUrl: "",
    language: "HTML",
    langColor: "#e34c26"
  },
  boitoan: {
    title: "Fortune Teller Web",
    descVi: "Fun interactive entertainment web application.",
    descEn: "Fun interactive entertainment web application.",
    tags: ["web", "fun"],
    category: "web",
    icon: "fa-solid fa-wand-magic-sparkles",
    accent: "linear-gradient(135deg, #ec4899, #be185d)",
    liveUrl: "",
    language: "Web App",
    langColor: "#38bdf8"
  }
};

let currentLang = "en";
let currentFilter = "all";
let allProjects = Object.entries(PROJECT_METADATA).map(([repo, meta]) => ({
  repo,
  htmlUrl: meta.htmlUrl !== undefined ? meta.htmlUrl : `https://github.com/${GITHUB_USER}/${repo}`,
  stars: 0,
  ...meta
}));

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  const filtered = allProjects.filter((p) => currentFilter === "all" || p.category === currentFilter);

  grid.innerHTML = filtered
    .map((p) => {
      const desc = currentLang === "vi" ? p.descVi : p.descEn;
      const codeBtn = p.htmlUrl
        ? `<a href="${p.htmlUrl}" target="_blank" rel="noopener noreferrer" class="projects__btn">
             <i class="fa-brands fa-github"></i> Code
           </a>`
        : "";
      const liveBtn = p.liveUrl
        ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="projects__btn projects__btn--primary">
             <i class="fa-solid fa-arrow-up-right-from-square"></i> Demo
           </a>`
        : "";
      const tagsHtml = p.tags.map((t) => `<span class="projects__tag">${t}</span>`).join("");

      return `
        <article class="projects__card">
          <div>
            <div class="projects__thumb">
              <div class="projects__icon-box" style="background: ${p.accent}">
                <i class="${p.icon}"></i>
              </div>
              <div class="projects__tags">${tagsHtml}</div>
            </div>
            <div class="projects__body">
              <h3 class="projects__title">${p.title}</h3>
              <p class="projects__desc">${desc}</p>
            </div>
          </div>
          <div class="projects__footer">
            <span class="projects__meta">
              <span class="lang-dot" style="background:${p.langColor}"></span>
              ${p.language}
            </span>
            <div class="projects__links">
              ${codeBtn}
              ${liveBtn}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

async function syncGitHubRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=30&sort=updated`);
    if (!res.ok) return;
    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) return;

    const standaloneProjects = Object.entries(PROJECT_METADATA)
      .filter(([key, meta]) => meta.htmlUrl === "" && !repos.some((r) => r.name === key))
      .map(([repo, meta]) => ({ repo, stars: 0, ...meta }));

    const githubProjects = repos.map((r) => {
      const meta = PROJECT_METADATA[r.name];
      if (meta) {
        return {
          repo: r.name,
          htmlUrl: r.html_url,
          stars: r.stargazers_count || 0,
          ...meta,
          liveUrl: meta.liveUrl || r.homepage || ""
        };
      }
      const lang = r.language || "Web";
      const category = lang.toLowerCase().includes("python")
        ? "python"
        : lang.toLowerCase().includes("php")
        ? "php"
        : "web";

      return {
        repo: r.name,
        title: r.name,
        descVi: r.description || "Dự án mã nguồn mở trên GitHub.",
        descEn: r.description || "Open-source repository on GitHub.",
        tags: [lang.toLowerCase()],
        category,
        icon: "fa-solid fa-code-branch",
        accent: "linear-gradient(135deg, #0ea5e9, #0369a1)",
        htmlUrl: r.html_url,
        liveUrl: r.homepage || "",
        language: lang,
        langColor: "#38bdf8",
        stars: r.stargazers_count || 0
      };
    });

    allProjects = [...standaloneProjects, ...githubProjects];
    document.getElementById("repoCount").textContent = allProjects.length;
    renderProjects();
  } catch {
    // Fallback to static PROJECT_METADATA if GitHub API rate-limits
  }
}

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
});

// Filter buttons
document.getElementById("projectFilters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  renderProjects();
});

// Certificate modal preview
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");
const certModalCaption = document.getElementById("certModalCaption");

function closeCertModal() {
  certModal.classList.remove("open");
  certModal.setAttribute("aria-hidden", "true");
}

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-cert-img]");
  if (!trigger) return;
  certModalImg.src = trigger.dataset.certImg;
  certModalCaption.textContent = trigger.dataset.certTitle || "";
  certModal.classList.add("open");
  certModal.setAttribute("aria-hidden", "false");
});

document.getElementById("certModalClose").addEventListener("click", closeCertModal);
document.getElementById("certModalBackdrop").addEventListener("click", closeCertModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && certModal.classList.contains("open")) {
    closeCertModal();
  }
});

// Initial render + GitHub sync
renderProjects();
syncGitHubRepos();
