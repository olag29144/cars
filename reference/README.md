# Reference — Asset Notes

## Source videos

| File | Purpose | Duration | Location |
|------|---------|----------|----------|
| `WhatsApp Video 2026-10-22 at 10.33.12.mp4` | Original reference (first supplied) | ~20.85 s | workspace root |
| `WhatsApp Video 2026-10-22 at 10.45.28.mp4` | Active reference (second supplied)  | ~12.08 s | workspace root |

Production copies live at:

- `static/assets/video/porsche-showcase.mp4` — **active, served to the browser**
- `static/assets/video/porsche-showcase-original.mp4` — backup of first reference

## Scene timecodes (active video — 12.08 s)

The 12.08 s video is divided evenly across 4 models:

| Pip | Model | Background key | Start | End |
|-----|-------|---------------|-------|-----|
| 01  | Porsche 911 F Series   | `mountain-road` | 0.0 s | 3.0 s |
| 02  | Porsche 911 (964)      | `winding-road`  | 3.0 s | 6.0 s |
| 03  | Porsche 911 (993)      | `desert-plain`  | 6.0 s | 9.0 s |
| 04  | Porsche 911 Carrera RS | `sunset-field`  | 9.0 s | 12.0 s |

## What was reconstructed vs. original

- **Panel layout, colours, typography, navigation pills, spec row** — recreated in CSS/HTML from visual inspection of the reference video.
- **Car animation** — the original supplied video is used directly as the `<video>` source. No car was reconstructed.
- **Scenic backgrounds** — no separate background image assets were available. The `background` field in `models.json` drives a CSS `data-bg` attribute on `.stage`, which applies a distinct muted colour tint per scene as a stand-in. If high-quality background images become available, add them to `static/assets/backgrounds/` and update the CSS `.stage[data-bg="..."]` rules to reference them.
- **Car images** — no isolated transparent-background car PNG assets were available. `static/assets/cars/` is reserved for future use.

## Colour token verification

Spec §4.1 target values vs. implemented:

| Token | Spec target | Implemented |
|-------|-------------|-------------|
| Page background | `#DCCDB1` | `#DCCDB1` ✓ |
| Panel surface | `#F8F5EC` | `#F8F5EC` ✓ |
| Primary text | `#242321` | `#242321` ✓ |
| Secondary text | `#777164` | `#777164` ✓ |
