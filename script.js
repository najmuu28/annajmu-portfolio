// Mobile navigation, section highlighting, scroll reveal, photo fallback.
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const navLinks = Array.from(nav.querySelectorAll("a"));

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
}

menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    setMenu(false);
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (nav.classList.contains("open") && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
    setMenu(false);
  }
});

window.matchMedia("(min-width: 851px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

// Mark the nav link for the section currently in view.
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === "#" + entry.target.id;
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((section) => navObserver.observe(section));

  // Fade sections in once as they enter the viewport.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}

// Show the monogram if the portrait photo is missing.
const portraitCard = document.getElementById("portraitCard");
const portraitImg = document.getElementById("portraitImg");

function markPhoto() { portraitCard.classList.add("has-photo"); }
function dropPhoto() { portraitImg.remove(); }

if (portraitImg.complete) {
  if (portraitImg.naturalWidth > 0) markPhoto(); else dropPhoto();
} else {
  portraitImg.addEventListener("load", markPhoto);
  portraitImg.addEventListener("error", dropPhoto);
}

// Keep the footer year current.
document.getElementById("year").textContent = new Date().getFullYear();
