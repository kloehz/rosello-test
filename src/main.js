const properties = [
  { id: 'dormida', title: 'Casa en La Dormida Country', operation: 'Venta', type: 'Casa', location: 'La Dormida Country', beds: 2, baths: 3, area: '800 m²', price: 185000, priceText: 'USD 185.000', image: './assets/images/property-dormida.jpg' },
  { id: 'depto-42', title: 'Departamento a estrenar', operation: 'Venta', type: 'Departamento', location: 'Capital Federal', beds: 1, baths: 1, area: '42 m²', price: 92000, priceText: 'USD 92.000', image: './assets/images/property-depto-42.jpg' },
  { id: 'terreno', title: 'Propiedad con gran terreno', operation: 'Venta', type: 'Casa', location: 'Pergamino', beds: 3, baths: 2, area: '350 m²', price: 75000, priceText: 'USD 75.000', image: './assets/images/property-terreno.jpg' },
  { id: 'depto-62', title: 'Departamento a estrenar', operation: 'Venta', type: 'Departamento', location: 'Capital Federal', beds: 2, baths: 1, area: '62 m²', price: 115000, priceText: 'USD 115.000', image: './assets/images/property-depto-62.jpg' },
  { id: 'quinta', title: 'Quinta con parque y pileta', operation: 'Venta', type: 'Campo / Quinta', location: 'Pergamino', beds: 3, baths: 2, area: '1.200 m²', price: 210000, priceText: 'USD 210.000', image: './assets/images/property-quinta.jpg' }
];

const WHATSAPP_URL = 'https://wa.me/5492477468005';


const WHATSAPP_ICON_PATH = 'M16.03 4C9.42 4 4.05 9.33 4.05 15.89c0 2.12.56 4.19 1.63 6.01L4 28l6.27-1.64a12.03 12.03 0 0 0 5.76 1.47c6.61 0 11.98-5.33 11.98-11.89C28.01 9.33 22.64 4 16.03 4Zm0 21.82c-1.85 0-3.66-.5-5.24-1.45l-.38-.23-3.72.97.99-3.6-.25-.39a9.82 9.82 0 0 1-1.36-4.98c0-5.45 4.47-9.88 9.96-9.88s9.96 4.43 9.96 9.88-4.47 9.68-9.96 9.68Zm5.46-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.48-.9-.79-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.47 0 1.45 1.07 2.86 1.22 3.06.15.2 2.1 3.18 5.09 4.46.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z';

function createWhatsAppIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'currentColor');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', WHATSAPP_ICON_PATH);
  svg.append(path);
  return svg;
}

function createWhatsAppButton() {
  const whatsapp = createElement('a', 'w-9 h-9 flex items-center justify-center bg-brand-forest hover:bg-brand-forestHover text-white rounded transition-colors focus-ring');
  whatsapp.href = WHATSAPP_URL;
  whatsapp.rel = 'noopener noreferrer';
  whatsapp.target = '_blank';
  whatsapp.title = 'Consultar por WhatsApp';
  whatsapp.setAttribute('aria-label', 'Consultar por WhatsApp');
  whatsapp.append(createWhatsAppIcon());
  return whatsapp;
}

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

function getSearchResults(form) {
  return properties.filter((property) => matches(property, getFilters(form)));
}

function assignClass(element, className) {
  element.className = className;
  return element;
}

function createElement(tagName, className, text = '') {
  const element = assignClass(document.createElement(tagName), className);
  if (text) element.textContent = text;
  return element;
}

function createResultCard(property) {
  const article = createElement('article', 'bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col');
  article.dataset.resultId = property.id;

  const imageWrap = createElement('div', 'relative h-48 w-full bg-gray-100');
  const image = createElement('img', 'w-full h-full object-cover');
  image.alt = property.title;
  image.src = property.image;
  const badge = createElement('span', 'absolute top-3 left-3 bg-brand-forest text-white text-[11px] font-bold px-2.5 py-1 rounded', property.operation.toUpperCase());
  imageWrap.append(image, badge);

  const body = createElement('div', 'p-4 flex-1 flex flex-col justify-between');
  const details = document.createElement('div');
  details.append(
    createElement('h3', 'font-bold text-sm text-brand-navy mb-1 line-clamp-1', property.title),
    createElement('p', 'text-xs text-brand-textMuted mb-3', property.location)
  );

  const meta = createElement('div', 'flex items-center gap-3 text-xs text-brand-textMuted border-t border-gray-100 pt-2 mb-3');
  meta.append(
    createElement('span', '', property.area),
    createElement('span', '', '·'),
    createElement('span', '', `${property.beds} dorm`),
    createElement('span', '', '·'),
    createElement('span', '', `${property.baths} baños`)
  );
  details.append(meta, createElement('div', 'text-base font-extrabold text-brand-navy mb-4', property.priceText));

  const actions = createElement('div', 'flex items-center gap-2 pt-2');
  const detailButton = createElement('button', 'flex-1 py-2 text-center text-xs font-bold text-brand-navy border border-brand-navy hover:bg-brand-navy hover:text-white rounded transition-colors focus-ring', 'VER DETALLE');
  detailButton.type = 'button';
  detailButton.addEventListener('click', (event) => showPropertyDetail(property.id, event.currentTarget));
  actions.append(detailButton, createWhatsAppButton());

  body.append(details, actions);
  article.append(imageWrap, body);
  return article;
}

function renderSearchResults(results, { searched = true } = {}) {
  const section = document.getElementById('resultados-busqueda');
  const list = document.getElementById('search-results-list');
  const status = document.getElementById('search-results-status');
  const count = document.getElementById('search-results-count');
  if (!section || !list || !status || !count) return [];

  list.replaceChildren();
  if (!searched) {
    status.textContent = 'Elegí tus filtros y tocá Buscar. Las propiedades destacadas se mantienen sin cambios.';
    count.textContent = 'Usá el buscador para ver propiedades de muestra.';
    return [];
  }

  if (!results.length) {
    status.textContent = 'No hay propiedades de muestra para esos filtros. Probá limpiar la búsqueda.';
    count.textContent = '0 resultados';
  } else {
    status.textContent = `Encontramos ${results.length} propiedad${results.length === 1 ? '' : 'es'} de muestra para tu búsqueda.`;
    count.textContent = `${results.length} resultado${results.length === 1 ? '' : 's'}`;
    results.forEach((property) => list.append(createResultCard(property)));
  }
  section.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  section.focus({ preventScroll: true });
  return results.map((property) => property.id);
}

function clearSearchResults() {
  return renderSearchResults([], { searched: false });
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

function getCarouselPageModel(cardCount, visibleCount) {
  const safeVisibleCount = Math.max(1, visibleCount || 1);
  const pageCount = Math.max(1, Math.ceil(cardCount / safeVisibleCount));
  return Array.from({ length: pageCount }, (_, index) => Math.min(index * safeVisibleCount, Math.max(0, cardCount - 1)));
}

function getVisibleCarouselCount(carousel, cards) {
  const firstCard = cards[0];
  if (!carousel || !firstCard) return 1;
  const cardWidth = firstCard.getBoundingClientRect().width || firstCard.offsetWidth || 320;
  const styles = window.getComputedStyle(carousel);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '24') || 24;
  return Math.max(1, Math.floor((carousel.clientWidth + gap) / (cardWidth + gap)));
}

function setActiveCarouselDot(activeIndex = 0) {
  document.querySelectorAll('.carousel-dot').forEach((dot, index) => dot.setAttribute('aria-current', String(index === activeIndex)));
}

function updateCarousel() {
  const carousel = document.getElementById('property-carousel');
  if (!carousel) return;
  const cards = [...carousel.querySelectorAll('[data-property-id]')];
  const pageStarts = getCarouselPageModel(cards.length, getVisibleCarouselCount(carousel, cards));
  carousel.dataset.pageStarts = pageStarts.join(',');
  const dots = document.getElementById('carousel-dots');
  if (dots) {
    dots.replaceChildren();
    pageStarts.forEach((cardIndex, pageIndex) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot w-2 h-2 bg-gray-300 rounded-full transition-all focus-ring';
      dot.setAttribute('aria-label', `Ir a grupo ${pageIndex + 1} de propiedades`);
      dot.setAttribute('aria-current', pageIndex === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => cards[cardIndex]?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', inline: 'start', block: 'nearest' }));
      dots.append(dot);
    });
  }
  setActiveCarouselDot(getCurrentCarouselPage(carousel));
}

function getCurrentCarouselPage(carousel) {
  const cards = [...carousel.querySelectorAll('[data-property-id]')];
  const starts = (carousel.dataset.pageStarts || '0').split(',').map(Number).filter((index) => Number.isFinite(index));
  return starts.reduce((best, cardIndex, pageIndex) => {
    const distance = Math.abs((cards[cardIndex]?.offsetLeft || 0) - carousel.scrollLeft);
    return distance < best.distance ? { index: pageIndex, distance } : best;
  }, { index: 0, distance: Infinity }).index;
}

function moveCarousel(direction) {
  const carousel = document.getElementById('property-carousel');
  if (!carousel) return;
  const cards = [...carousel.querySelectorAll('[data-property-id]')];
  const starts = (carousel.dataset.pageStarts || '0').split(',').map(Number).filter((index) => Number.isFinite(index));
  const nextPage = Math.min(Math.max(getCurrentCarouselPage(carousel) + direction, 0), Math.max(0, starts.length - 1));
  cards[starts[nextPage]]?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
  setActiveCarouselDot(nextPage);
}

function prefersReducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

function setup() {
  const searchForm = document.getElementById('search-form');
  searchForm?.addEventListener('submit', (event) => { event.preventDefault(); renderSearchResults(getSearchResults(searchForm)); });
  document.getElementById('reset-search')?.addEventListener('click', () => { searchForm.reset(); clearSearchResults(); updateCarousel(); });

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
  document.getElementById('carousel-prev-btn')?.addEventListener('click', () => moveCarousel(-1));
  document.getElementById('carousel-next-btn')?.addEventListener('click', () => moveCarousel(1));
  carousel?.addEventListener('scroll', () => setActiveCarouselDot(getCurrentCarouselPage(carousel)));
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', setup);
}
export { properties, matches, getCarouselPageModel, WHATSAPP_ICON_PATH };
