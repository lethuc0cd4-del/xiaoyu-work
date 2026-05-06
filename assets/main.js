const nav = document.querySelector('[data-elevate]');
const menuButton = document.querySelector('.menu-btn');
const revealItems = document.querySelectorAll('.reveal');

const syncNav = () => {
  nav.classList.toggle('is-elevated', window.scrollY > 16);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));
window.addEventListener('scroll', syncNav, { passive: true });
syncNav();

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
