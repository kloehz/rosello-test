import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { properties, matches, getCarouselPageModel, WHATSAPP_ICON_PATH, getFiltersFromSearchParams, getResultsForFilters } from '../src/main.js';

const html = readFileSync('index.html', 'utf8');
const resultsHtml = readFileSync('resultados.html', 'utf8');
const contactHtml = readFileSync('contacto.html', 'utf8');
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

test('search and contact are real standalone static pages', () => {
  assert.equal(existsSync('resultados.html'), true);
  assert.equal(existsSync('contacto.html'), true);
  assert.ok(resultsHtml.includes('data-purpose="search-results-page"'));
  assert.ok(contactHtml.includes('data-purpose="contact-page" id="contacto"'));
});

test('index search form navigates to resultados.html instead of rendering same-page results', () => {
  assert.ok(html.includes('id="search-form" action="./resultados.html" method="get"'));
  assert.equal(html.includes('id="resultados-busqueda"'), false);
  assert.equal(html.includes('id="search-results-list"'), false);
  assert.equal(mainJs.includes('window.location.href = buildResultsUrl'), false);
  assert.equal(mainJs.includes('card.hidden'), false);
  assert.equal(mainJs.includes('setVisibleCards'), false);
});

test('results page reads query filters and can produce an empty state', () => {
  const filters = getFiltersFromSearchParams(new URLSearchParams('operation=Venta&type=Departamento&location=Capital+Federal&beds=2+dormitorios&price=Hasta+USD+120.000'));
  assert.deepEqual(getResultsForFilters(filters).map((property) => property.id), ['depto-62']);
  const emptyFilters = getFiltersFromSearchParams(new URLSearchParams('operation=Alquiler'));
  assert.deepEqual(getResultsForFilters(emptyFilters), []);
  assert.ok(mainJs.includes('No hay propiedades de muestra para esos filtros'));
  assert.ok(resultsHtml.includes('href="./index.html#buscador"'));
});

test('header and contact CTAs point to contacto.html', () => {
  assert.ok(html.includes('href="./contacto.html">CONTACTO</a>'));
  assert.ok(html.includes('href="./contacto.html">Contacto</a>'));
  assert.ok(html.includes('href="./contacto.html">TASÁ TU PROPIEDAD</a>'));
  assert.equal(html.includes('href="#contacto"'), false);
  assert.equal(/<footer[^>]*id="contacto"/.test(html), false);
});

test('carousel pagination is page-based instead of one dot per card when multiple cards are visible', () => {
  assert.deepEqual(getCarouselPageModel(5, 4), [0, 4]);
  assert.deepEqual(getCarouselPageModel(5, 2), [0, 2, 4]);
  assert.ok(getCarouselPageModel(properties.length, 4).length < properties.length);
});

test('WhatsApp property actions use inline icons instead of raw W labels', () => {
  for (const documentHtml of [html, resultsHtml, contactHtml]) {
    assert.equal(/>W<\/a>/.test(documentHtml), false);
  }
  assert.equal(/>W<\/a>/.test(mainJs), false);
  assert.ok(html.includes('<svg aria-hidden="true" viewBox="0 0 32 32"'));
  assert.ok(WHATSAPP_ICON_PATH.includes('M16.03 4'));
  assert.ok(mainJs.includes('createElementNS'));
  assert.equal(mainJs.includes('innerHTML'), false);
});

test('documents have no duplicate ids and local hash links target existing ids', () => {
  for (const documentHtml of [html, resultsHtml, contactHtml]) {
    const ids = [...documentHtml.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    assert.deepEqual(duplicates, []);
    const idSet = new Set(ids);
    const hashes = [...documentHtml.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(hashes.filter((hash) => !idSet.has(hash)), []);
  }
});

test('static asset paths are relative and local except approved external links', () => {
  for (const documentHtml of [html, resultsHtml, contactHtml]) {
    assert.equal(documentHtml.includes('cdn.tailwindcss.com'), false);
    const srcs = [...documentHtml.matchAll(/\ssrc="([^"]+)"/g)].map((match) => match[1]);
    assert.ok(srcs.every((src) => src.startsWith('./')));
    const blankLinks = [...documentHtml.matchAll(/<a[^>]+target="_blank"[^>]*>/g)].map((match) => match[0]);
    assert.ok(blankLinks.length > 0);
    assert.ok(blankLinks.every((tag) => /rel="[^"]*noopener/.test(tag)));
  }
});
