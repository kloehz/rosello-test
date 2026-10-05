# Demo estático Grupo Rossello

Demo interactivo de la landing provista para Grupo Rossello Inmobiliaria. Mantiene la composición visual de Stitch, usa Tailwind compilado y JavaScript vanilla, sin backend ni autenticación real.

## Uso rápido

1. Instalá dependencias: `npm install`
2. Generá la versión publicable: `npm run build`
3. Probá los checks: `npm test`
4. Previsualizá `dist`: `npm run preview`

## Qué incluye

- Buscador estático que navega a `resultados.html` con filtros por query string.
- Página `contacto.html` independiente con WhatsApp, email y datos de atención.
- Filtros demostrativos sobre las cinco propiedades de muestra originales.
- Imágenes remotas descargadas a `assets/images/` para uso estático.
- Logo renderizado desde `logos, colores y tipografia.pdf` con PDFKit/AppKit.
- Modal de detalle con datos de la tarjeta, marcado claramente como demo.
- Login demostrativo que no valida, guarda ni transmite credenciales.
- Enlaces de WhatsApp reales conservados.

## Publicación en GitHub Pages

Opción simple: publicá el contenido de `dist/` en la rama o fuente que elijas para Pages. El build usa rutas relativas, así que funciona bajo subrutas como `usuario.github.io/repositorio/`.

Este documento no ejecuta `git`, no crea ramas y no publica nada automáticamente.

## Limitaciones honestas

- La fuente Montserrat se carga desde Google Fonts; no se autoalojó para evitar sumar descarga y licenciamiento de fuentes al demo.
- No hay catálogo real, panel privado, analítica, formularios enviados ni backend.
- Los textos legales del footer son marcadores explícitos de demo, no documentos legales.
