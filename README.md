# Despliegue Logístico Post-Terremoto — Dashboard

Dashboard interactivo (React + Vite + Tailwind CSS) para visualizar el despliegue logístico
post-terremoto en el estado La Guaira: distribución por zona, fuentes de donación,
ranking de parroquias y tabla filtrable/ordenable.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (incluye `npm`)
- Visual Studio Code (recomendado)

## Cómo abrir el proyecto en VS Code

1. Descomprime este proyecto en una carpeta de tu PC.
2. Abre VS Code → `Archivo > Abrir carpeta...` → selecciona la carpeta del proyecto.
3. Abre una terminal integrada en VS Code (`Ctrl+ñ` / `Ctrl+\`` o menú `Terminal > Nueva terminal`).

## Instalación

```bash
npm install
```

## Modo desarrollo (con recarga en vivo)

```bash
npm run dev
```

Esto levanta un servidor local (normalmente en `http://localhost:5173`). Cada vez que
edites un archivo en `src/`, el navegador se actualiza automáticamente — ideal para ver
el desarrollo en tiempo real mientras trabajas en VS Code.

## Compilar para producción

```bash
npm run build
```

Genera una carpeta `dist/` con los archivos estáticos optimizados, listos para subir a
Vercel, Netlify, Pantheon (como sitio estático) o cualquier hosting.

Para previsualizar ese build de producción localmente:

```bash
npm run preview
```

## Estructura del proyecto

```
├── index.html                  # HTML raíz de Vite
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                 # Punto de entrada React
│   ├── App.jsx                  # Composición general del dashboard
│   ├── index.css                # Tema oscuro global
│   ├── data/
│   │   ├── parishes.js          # 26 parroquias, zonas y totales
│   │   ├── donors.js            # Fuentes de donación
│   │   └── directory.js         # Presbíteros y direcciones de cada parroquia
│   ├── utils/
│   │   └── format.js            # Formato numérico (es-VE) y búsqueda sin acentos
│   ├── hooks/
│   │   ├── useInView.js         # Animar una vez al entrar en pantalla
│   │   └── useClipIndicator.js  # Indicador deslizante de pestañas
│   ├── assets/
│   │   ├── caritas-logo.webp    # Logo de Cáritas La Guaira (footer)
│   │   ├── caritas-isotipo.webp # Isotipo (cabecera)
│   │   └── maps/                # Mapas SVG del estado y de cada zona
│   └── components/
│       ├── SiteHeader.jsx       # Identidad de Cáritas
│       ├── Header.jsx           # Título, KPIs y buscador de parroquias
│       ├── ParishFinder.jsx     # Buscador "Busca tu parroquia"
│       ├── SectionNav.jsx       # Navegación fija por secciones
│       ├── Donut.jsx            # Gráfica de dona en SVG
│       ├── Odometer.jsx         # Cifras que ruedan hasta su valor
│       ├── ZoneDistributionCard.jsx
│       ├── DonorsCard.jsx
│       ├── TopParishesCard.jsx
│       ├── MapCard.jsx          # Mapa interactivo con zoom
│       ├── ParishModal.jsx      # Detalle de cada parroquia
│       ├── ParishTable.jsx      # Tabla filtrable, buscable y ordenable
│       └── Footer.jsx
```

## Próximos pasos sugeridos (para escalar)

- Mover `src/data/*.js` a un backend o CMS si los datos van a actualizarse con frecuencia.
- Agregar pruebas (Vitest + React Testing Library).
- Conectar un pipeline de despliegue continuo (Vercel/Netlify) al hacer push a Git.
