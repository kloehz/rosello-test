const properties = [
  { id: 'dormida', title: 'Casa en La Dormida Country', operation: 'Venta', type: 'Casa', location: 'La Dormida Country', beds: 2, baths: 3, area: '800 m²', price: 185000, priceText: 'USD 185.000', image: './assets/images/property-dormida.jpg' },
  { id: 'depto-42', title: 'Departamento a estrenar', operation: 'Venta', type: 'Departamento', location: 'Capital Federal', beds: 1, baths: 1, area: '42 m²', price: 92000, priceText: 'USD 92.000', image: './assets/images/property-depto-42.jpg' },
  { id: 'terreno', title: 'Propiedad con gran terreno', operation: 'Venta', type: 'Casa', location: 'Pergamino', beds: 3, baths: 2, area: '350 m²', price: 75000, priceText: 'USD 75.000', image: './assets/images/property-terreno.jpg' },
  { id: 'depto-62', title: 'Departamento a estrenar', operation: 'Venta', type: 'Departamento', location: 'Capital Federal', beds: 2, baths: 1, area: '62 m²', price: 115000, priceText: 'USD 115.000', image: './assets/images/property-depto-62.jpg' },
  { id: 'quinta', title: 'Quinta con parque y pileta', operation: 'Venta', type: 'Campo / Quinta', location: 'Pergamino', beds: 3, baths: 2, area: '1.200 m²', price: 210000, priceText: 'USD 210.000', image: './assets/images/property-quinta.jpg' }
];

const WHATSAPP_URL = 'https://wa.me/5492477468005';

function matches(property, filters) {
  const locationOk = filters.location === 'Todas' || property.location.includes(filters.location) || (filters.location === 'Zona Norte' && property.location === 'La Dormida Country');
  const bedsOk = filters.beds === 'Todos' || (filters.beds === '3 o más' ? property.beds >= 3 : property.beds === Number(filters.beds[0]));
  const priceOk = filters.price === 'Indiferente' || (filters.price === 'Más de USD 200.000' ? property.price > 200000 : property.price <= Number(filters.price.replace(/\D/g, '')));
  return (filters.operation === 'Todas' || property.operation === filters.operation)
    && (filters.type === 'Todas' || property.type === filters.type)
    && locationOk && bedsOk && priceOk;
}

function getFilters(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function setVisibleCards(form) {
  const visible = properties.filter((property) => matches(property, getFilters(form))).map((property) => property.id);
  document.querySelectorAll('[data-property-id]').forEach((card) => { card.hidden = !visible.includes(card.dataset.propertyId); });
  const empty = document.getElementById('empty-results');
  if (empty) empty.hidden = visible.length > 0;
  updateCarousel();
  return visible;
}

function openDialog(dialog, trigger) {
  dialog.dataset.returnFocus = trigger?.id || '';
  dialog.classList.remove('hidden');
  dialog.classList.add('flex');
  document.body.classList.add('modal-open');
  const focusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusable?.focus();
}

function closeDialog(dialog) {
  dialog.classList.add('hidden');
  dialog.classList.remove('flex');
  document.body.classList.remove('modal-open');
  const returnFocus = dialog.dataset.returnFocus && document.getElementById(dialog.dataset.returnFocus);
  returnFocus?.focus();
}

function trapFocus(dialog, event) {
  if (event.key !== 'Tab') return;
  const nodes = [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((node) => !node.disabled && node.offsetParent !== null);
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) { last.focus(); event.preventDefault(); }
  if (!event.shiftKey && document.activeElement === last) { first.focus(); event.preventDefault(); }
}

function showPropertyDetail(id, trigger) {
  const property = properties.find((item) => item.id === id);
  const dialog = document.getElementById('property-modal');
  if (!property || !dialog) return;
  dialog.querySelector('[data-detail-title]').textContent = property.title;
  dialog.querySelector('[data-detail-location]').textContent = property.location;
  dialog.querySelector('[data-detail-meta]').textContent = `${property.area} · ${property.beds} dorm · ${property.baths} baños`;
  dialog.querySelector('[data-detail-price]').textContent = property.priceText;
  dialog.querySelector('[data-detail-image]').src = property.image;
  dialog.querySelector('[data-detail-image]').alt = property.title;
  openDialog(dialog, trigger);
}

function updateCarousel() {
  const carousel = document.getElementById('property-carousel');
  if (!carousel) return;
  const visibleCards = [...carousel.querySelectorAll('[data-property-id]')].filter((card) => !card.hidden);
  const dots = document.getElementById('carousel-dots');
  if (dots) {
    dots.innerHTML = '';
    visibleCards.forEach((card, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot w-2 h-2 bg-gray-300 rounded-full transition-all focus-ring';
      dot.setAttribute('aria-label', `Ir a propiedad ${index + 1}`);
      dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => card.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', inline: 'start', block: 'nearest' }));
      dots.append(dot);
    });
  }
}

function prefersReducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

function setup() {
  const searchForm = document.getElementById('search-form');
  searchForm?.addEventListener('submit', (event) => { event.preventDefault(); setVisibleCards(searchForm); });
  document.getElementById('reset-search')?.addEventListener('click', () => { searchForm.reset(); setVisibleCards(searchForm); });

  document.querySelectorAll('[data-detail-for]').forEach((button, index) => {
    button.id ||= `detail-button-${index}`;
    button.addEventListener('click', () => showPropertyDetail(button.dataset.detailFor, button));
  });

  document.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', () => closeDialog(button.closest('[role="dialog"]'))));
  document.querySelectorAll('[role="dialog"]').forEach((dialog) => {
    dialog.addEventListener('click', (event) => { if (event.target.dataset.backdrop !== undefined) closeDialog(dialog); });
    dialog.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDialog(dialog); trapFocus(dialog, event); });
  });

  document.querySelectorAll('[data-open-login]').forEach((button, index) => {
    button.id ||= `open-login-${index}`;
    button.addEventListener('click', () => openDialog(document.getElementById('login-modal'), button));
  });

  document.getElementById('demo-login-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('login-demo-message').textContent = 'Esta demostración no valida, guarda ni transmite credenciales.';
  });

  const menu = document.getElementById('mobile-menu');
  document.getElementById('mobile-menu-button')?.addEventListener('click', () => {
    const hidden = menu.hasAttribute('hidden');
    menu.toggleAttribute('hidden', !hidden);
    document.getElementById('mobile-menu-button').setAttribute('aria-expanded', String(hidden));
  });
  menu?.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', () => menu.setAttribute('hidden', '')));

  const carousel = document.getElementById('property-carousel');
  const step = () => Math.min(340, carousel?.clientWidth || 340);
  document.getElementById('carousel-prev-btn')?.addEventListener('click', () => carousel.scrollBy({ left: -step(), behavior: prefersReducedMotion() ? 'auto' : 'smooth' }));
  document.getElementById('carousel-next-btn')?.addEventListener('click', () => carousel.scrollBy({ left: step(), behavior: prefersReducedMotion() ? 'auto' : 'smooth' }));
  carousel?.addEventListener('scroll', () => {
    const cards = [...carousel.querySelectorAll('[data-property-id]')].filter((card) => !card.hidden);
    const active = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - carousel.scrollLeft) < best.distance ? { index, distance: Math.abs(card.offsetLeft - carousel.scrollLeft) } : best, { index: 0, distance: Infinity }).index;
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => dot.setAttribute('aria-current', String(index === active)));
  });
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', setup);
}
export { properties, matches };
