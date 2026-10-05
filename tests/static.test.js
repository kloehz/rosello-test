import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { properties, matches } from '../src/main.js';

const html = readFileSync('index.html', 'utf8');

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
