import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { properties, matches, getCarouselPageModel, WHATSAPP_ICON_PATH } from '../src/main.js';

const html = readFileSync('index.html', 'utf8');
const mainJs = readFileSync('src/main.js', 'utf8');

test('filter metadata matches original sample cards', () => {
  assert.equal(properties.length, 5);
  assert.deepEqual(
    properties.filter((property) => matches(property, { operation: 'Venta', type: 'Departamento', location: 'Capital Federal', beds: '2 dormitorios', price: 'Hasta USD 120.000' })).map((property) => property.id),
    ['depto-62']
  );
  assert.deepEqual(
    properties.filter((property) => matches(property, { operation: 'Alquiler', type: 'Todas', location: 'Todas', beds: 'Todos', price: 'Indiferente' })).map((property) => property.id),
    []
  );
});

test('search renders into its own results section without hiding featured cards', () => {
  assert.ok(html.includes('id="resultados-busqueda"'));
  assert.ok(html.includes('id="search-results-list"'));
  assert.ok(html.includes('Usá el buscador para ver propiedades de muestra.'));
  assert.equal(mainJs.includes('card.hidden'), false);
  assert.equal(mainJs.includes('setVisibleCards'), false);
});

test('carousel pagination is page-based instead of one dot per card when multiple cards are visible', () => {
  assert.deepEqual(getCarouselPageModel(5, 4), [0, 4]);
  assert.deepEqual(getCarouselPageModel(5, 2), [0, 2, 4]);
  assert.ok(getCarouselPageModel(properties.length, 4).length < properties.length);
});


test('contact has a prominent same-page section before the footer', () => {
  assert.ok(html.includes('data-purpose="contact-section" id="contacto"'));
  assert.ok(html.includes('Hablemos de tu próxima operación'));
  assert.ok(html.indexOf('id="contacto"') < html.indexOf('data-purpose="footer-section"'));
  assert.equal(/<footer[^>]*id="contacto"/.test(html), false);
});

test('WhatsApp property actions use inline icons instead of raw W labels', () => {
  assert.equal(/>W<\/a>/.test(html), false);
  assert.equal(/>W<\/a>/.test(mainJs), false);
  assert.ok(html.includes('<svg aria-hidden="true" viewBox="0 0 32 32"'));
  assert.ok(WHATSAPP_ICON_PATH.includes('M16.03 4'));
  assert.ok(mainJs.includes('createElementNS'));
  assert.equal(mainJs.includes('innerHTML'), false);
});

test('document has no duplicate ids and all hash links target existing ids', () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, []);
  const idSet = new Set(ids);
  const hashes = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(hashes.filter((hash) => !idSet.has(hash)), []);
});

test('static asset paths are relative and local except approved external links', () => {
  assert.equal(html.includes('cdn.tailwindcss.com'), false);
  const srcs = [...html.matchAll(/\ssrc="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(srcs.every((src) => src.startsWith('./')));
  const blankLinks = [...html.matchAll(/<a[^>]+target="_blank"[^>]*>/g)].map((match) => match[0]);
  assert.ok(blankLinks.length > 0);
  assert.ok(blankLinks.every((tag) => /rel="[^"]*noopener/.test(tag)));
});
