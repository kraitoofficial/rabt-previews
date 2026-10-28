/**
 * Rabt Documentation - Interactive System
 * Replicating codebase interactions, theme toggle, search, code copy
 * Copyright (c) 2024-2026 Kraito. All rights reserved.
 */

(function () {
  "use strict";

  // 1. Theme Switcher (Synchronized with localStorage & OS preference)
  const THEME_KEY = "rabt-theme";

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
    }
    updateLogos(theme);
  }

  function updateLogos(theme) {
    const logos = document.querySelectorAll(".sidebar-logo, .hero-logo");
    logos.forEach((img) => {
      const isHero = img.classList.contains("hero-logo");
      const basePrefix = img.getAttribute("src").includes("../") ? "../" : "";
      // Light theme uses dark logo (dark text on light bg), Dark theme uses light logo (white text on dark bg)
      const targetSrc = theme === "dark"
        ? basePrefix + "image/rabt-light.png"
        : basePrefix + "image/rabt-dark.png";
      if (img.getAttribute("src") !== targetSrc) {
        img.setAttribute("src", targetSrc);
      }
    });
  }

  // Apply early to avoid FOUC
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  document.addEventListener("DOMContentLoaded", function () {
    // Re-verify logos on DOM ready
    updateLogos(getPreferredTheme());

    // Theme toggle button
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
        const next = current === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    }

    // 2. Mobile Sidebar & Drawer Overlay
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    let overlay = document.querySelector(".sidebar-overlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "sidebar-overlay";
      document.body.appendChild(overlay);
    }

    function openSidebar() {
      if (sidebar) sidebar.classList.add("open");
      if (overlay) overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        if (sidebar && sidebar.classList.contains("open")) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", closeSidebar);
    }

    // Close on ESC key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeSidebar();
      }
    });

    // Close sidebar on link click (mobile)
    if (sidebar) {
      sidebar.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", function () {
          if (window.innerWidth <= 1024) {
            closeSidebar();
          }
        });
      });
    }

    // 3. Code Block Enhancement (Wrapper, Header with Language & Copy Button)
    const codeBlocks = document.querySelectorAll("pre");
    codeBlocks.forEach((pre) => {
      // Avoid wrapping twice
      if (pre.parentElement.classList.contains("code-block-wrapper")) return;

      const codeEl = pre.querySelector("code") || pre;
      const codeClass = codeEl.className || "";
      let lang = "TEXT";

      const langMatch = codeClass.match(/language-([a-zA-Z0-9_-]+)/);
      if (langMatch) {
        lang = langMatch[1].toUpperCase();
      } else {
        const text = codeEl.textContent.trim();
        if (text.startsWith("npm ") || text.startsWith("bun ") || text.startsWith("npx ") || text.startsWith("git ") || text.startsWith("docker ")) {
          lang = "BASH";
        } else if (text.includes("NEXT_PUBLIC_") || text.includes("SMTP_") || text.includes("SUPABASE_")) {
          lang = "ENV";
        } else if (text.startsWith("{") || text.startsWith("[")) {
          lang = "JSON";
        } else if (text.includes("SELECT ") || text.includes("CREATE TABLE") || text.includes("ALTER TABLE")) {
          lang = "SQL";
        }
      }

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";

      const header = document.createElement("div");
      header.className = "code-header";

      const langSpan = document.createElement("span");
      langSpan.className = "code-lang";
      langSpan.textContent = lang;

      const copyBtn = document.createElement("button");
      copyBtn.className = "code-copy-btn";
      copyBtn.type = "button";
      copyBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span>Copy</span>
      `;

      copyBtn.addEventListener("click", async () => {
        const codeText = codeEl.textContent;
        try {
          await navigator.clipboard.writeText(codeText);
          copyBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span style="color:#10b981;font-weight:600;">Copied</span>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              <span>Copy</span>
            `;
          }, 2000);
        } catch (err) {
          copyBtn.querySelector("span").textContent = "Failed";
        }
      });

      header.appendChild(langSpan);
      header.appendChild(copyBtn);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });

    // 4. Quick Search / Filter
    const searchInput = document.getElementById("docSearch");
    if (searchInput) {
      // Focus shortcut ('/' or 'Ctrl+K' / 'Cmd+K')
      document.addEventListener("keydown", function (e) {
        if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      });

      // Simple real-time page content highlighting or quick navigation
      searchInput.addEventListener("input", function (e) {
        const query = e.target.value.toLowerCase().trim();
        const navLinks = document.querySelectorAll(".nav-menu a");
        if (!query) {
          navLinks.forEach((a) => {
            a.style.display = "";
          });
          return;
        }

        navLinks.forEach((a) => {
          const text = a.textContent.toLowerCase();
          if (text.includes(query)) {
            a.style.display = "flex";
          } else {
            a.style.display = "none";
          }
        });
      });
    }

    // 5. Active Link Highlight
    const currentPath = window.location.pathname.replace(/\/$/, "");
    const links = document.querySelectorAll(".nav-menu a");
    links.forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;
      const cleanHref = href.replace(/^\.\.\//, "").replace(/^\.\//, "");
      if (currentPath.endsWith(cleanHref) || (currentPath.endsWith("/documentation") && cleanHref === "index.html")) {
        links.forEach((l) => l.classList.remove("active"));
        a.classList.add("active");
      }
    });
  });
})();
