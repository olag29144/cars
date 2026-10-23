# RODR | DESIGN — Porsche 911 Showcase

A minimalist automotive presentation website recreating the reference video design.
Features a warm beige canvas (`#DCCDB1`), floating ivory panel (`#F8F5EC`), vertical
navigation pills, and the original Porsche 911 animation video playing inline with
per-model scene segments.

> **Asset transparency** — The car animation uses the original supplied reference
> video as its source. Scenic background images were not available; the `background`
> field in `models.json` drives a per-scene colour tint instead. See
> `reference/README.md` for the full asset inventory and what was reconstructed.

---

## Stack

- **Python 3 + Flask** — backend and template rendering
- **HTML5 + CSS3** — layout, design system, transitions
- **Vanilla JavaScript** — video segment control, navigation, scene transitions
- No frontend frameworks, no database

---

## Project Structure

```
automotive-showcase/
├── app.py                        Flask application
├── requirements.txt              Python dependencies
├── README.md
├── data/
│   └── models.json               Porsche model metadata + scene timecodes
├── templates/
│   └── index.html                Jinja2 page template
├── static/
│   ├── css/
│   │   └── style.css             Full design system
│   ├── js/
│   │   └── main.js               Video sequencing + navigation logic
│   └── assets/
│       ├── video/
│       │   └── porsche-showcase.mp4   Reference animation (required)
│       ├── cars/                 (reserved for supplementary car images)
│       ├── backgrounds/          (reserved for supplementary backgrounds)
│       └── fonts/                (reserved for local font files)
└── reference/
    └── README.md                 Notes on the source reference video
```

---

## Quick Start

### 1. Prerequisites

- Python 3.9 or newer
- pip

### 2. Create and activate a virtual environment (recommended)

**Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the development server

```bash
python app.py
```

Then open your browser at: **http://localhost:5000**

---

## How It Works

### Navigation
The four numbered pills on the left of the panel correspond to:

| Pill | Model              | Video Segment |
|------|--------------------|---------------|
| 01   | Porsche 911 F Series | 0.0 – 5.5 s  |
| 02   | Porsche 911 (964)   | 5.5 – 11.5 s |
| 03   | Porsche 911 (993)   | 11.5 – 17.0 s|
| 04   | Porsche 911 Carrera RS | 17.0 – 20.85 s |

Clicking a pill triggers a brief overlay fade, seeks the video to the matching
segment, loops it, and updates the model title and specification row.

### Video
The original `porsche-showcase.mp4` is served from `static/assets/video/`.
If the video is unavailable, a CSS-animated car silhouette fallback is shown
automatically.

### Model Data
`data/models.json` drives both the Jinja2 template (server-side rendering) and
the JavaScript segment timecodes. Edit it to adjust specs or timing without
touching HTML or JS.

### API Endpoints
| Route | Description |
|-------|-------------|
| `GET /` | Renders the main page |
| `GET /api/models` | Returns all model data as JSON |
| `GET /api/models/<model_id>` | Returns a single model by id |

---

## Customisation

All colors are CSS custom properties at the top of `style.css`:

```css
--color-page-bg:       #D9C9B0;   /* warm beige canvas */
--color-panel-surface: #F4EFE4;   /* ivory panel */
--color-text-primary:  #1E1C19;   /* charcoal text */
```

Adjust these to match any visual comparison against the reference.

---

## Notes on Asset Fidelity

The car animation uses the original supplied reference video as its source,
preserving the exact car movements, lighting, and scene order from the reference.
The surrounding interface (panel, navigation, typography, colors) is a faithful
CSS recreation of the reference design.
