# Home page design spec — AI and the Future of Employment

Figma-ready tokens and layout for the **home page only**. Rebuild in Figma using these values, then match implementation to the approved mockups in this folder.

## Frames to recreate in Figma

| Frame | File | Size |
|---|---|---|
| Desktop — Hero | `home-desktop-hero.jpg` | 1440 × 900 |
| Desktop — Research question | `home-desktop-question.jpg` | 1440 × 810 |
| Desktop — Audience | `home-desktop-audience.jpg` | 1440 × 810 |
| Desktop — Portals | `home-desktop-portals.jpg` | 1440 × 900 |
| Mobile — Full scroll | `home-mobile-full.jpg` | 390 × 844 |

Suggested Figma page: `Home / Design`. Place frames top-to-bottom in scroll order. Import mockup images as reference layers at 40% opacity while you rebuild vectors on top.

---

## Color styles (Figma Variables / Color styles)

| Name | Hex | Use |
|---|---|---|
| `color/primary` | `#012578` | Brand, headings, links, footer |
| `color/ink` | `#0C1220` | Strong body / display ink |
| `color/text` | `#1A2233` | Body text |
| `color/text-secondary` | `#5A6578` | Supporting copy |
| `color/accent` | `#0D6E6E` | Eyebrows, index numbers |
| `color/accent-soft` | `#D7EFEF` | Soft accent fills if needed |
| `color/page` | `#F3F5F9` | Page background |
| `color/surface` | `#FFFFFF` | Portal content panels, buttons |
| `color/border` | `#D9DEE8` | Hairlines, portal borders |
| `color/hero-scrim` | `rgba(1,16,42,0.92)` | Bottom of hero gradient |

Hero media overlay: linear gradient from `rgba(1,20,55,0.25)` at top → `rgba(1,16,42,0.92)` at bottom, plus a soft teal radial at top-left if desired.

---

## Typography (Figma text styles)

**Fonts:** Fraunces (display), Sora (UI / body). Fallbacks: Georgia, system-ui.

| Style | Font | Size / LH | Weight | Color |
|---|---|---|---|---|
| `display/hero` | Fraunces | 64 / 72 (clamp 38–70) | 700 | `#FFFFFF` |
| `display/section` | Fraunces | 40 / 48 | 700 | `primary` or `#FFFFFF` on dark |
| `display/portal-title` | Fraunces | 22 / 28 | 700 | `primary` |
| `body/lead` | Sora | 22 / 32 | 400 | white 90% or `text-secondary` |
| `body/default` | Sora | 16 / 26 | 400 | `text` / `text-secondary` |
| `ui/eyebrow` | Sora | 12 / 16 | 600 | `accent`, tracking +0.14em, uppercase |
| `ui/nav` | Sora | 14 / 20 | 500 | `text-secondary` (active = `primary`) |
| `ui/button` | Sora | 15 / 20 | 600 | per button |
| `ui/portal-index` | Sora | 12 / 16 | 600 | `accent`, tracking +0.12em |
| `ui/brand` | Fraunces | 17 / 22 | 700 | `primary` |

Max headline measure: ~14–22ch. Body measure: ~36–44ch.

---

## Spacing & grid

- Base unit: **8px**
- Desktop content max width for bands below hero: **1120px** centered (portals/audience), with **24px** side padding
- Section vertical padding: **72px** desktop / **48px** mobile
- Portal grid gap: **20px**
- Sticky top bar height: **56–64px**
- Button height: **48px**, horizontal padding **20px**, radius **999px**

---

## Components

### Top bar
- Sticky, translucent `page` at 92% + blur
- Left: brand link `AI & Employment`
- Right (desktop): Research question · Audience · Explore
- Mobile: brand + compact link row wrapping under brand

### Button / Primary
- Fill `#FFFFFF`, text `primary`, pill radius
- Hover: translateY −2px

### Button / Ghost
- Transparent, 1px white border @ 55% opacity, white text
- Hover: white fill at 10%

### Portal (interactive tile)
- Structure: image area **220px** tall (desktop) → content panel with border
- Content: index, title, question (1–2 lines), CTA `Open this view →`
- Hover: lift −6px, soft navy shadow `0 18px 40px rgba(1,37,120,0.12)`, image scale 1.05
- These are the **only** card-like containers on the page

### Audience row
- Not a card: top hairline, title + description
- Four rows: Students, Employees, Employers, Policymakers

---

## Page structure (auto-layout order)

1. **Top bar**
2. **Hero** — full viewport height; media edge-to-edge; copy bottom-aligned left
   - H1: AI and the Future of Employment
   - Lead: Who is most exposed, and how is work changing?
   - CTAs: Explore the questions (primary) · Read the research question (ghost)
3. **Research question band** — dark gradient; one job only
4. **Audience band** — light; two columns desktop, stack mobile
5. **Explore portals** — 2×2 desktop, 1 column mobile
6. **Footer** — `primary` fill; team / explore / links (implementation may already include this)

### Hero rules (do not break)
- Brand/title is the dominant signal
- No badges, chips, stats, or floating callouts on the image
- One composition in the first viewport

---

## Image assets (site)

| Role | Path |
|---|---|
| Hero | `../../img/hero-employment.jpg` |
| Portal 01 Jobs | `../../img/portal-jobs.jpg` |
| Portal 02 Tasks | `../../img/portal-tasks.jpg` |
| Portal 03 Adoption | `../../img/portal-adoption.jpg` |
| Portal 04 Careers | `../../img/portal-careers.jpg` |

---

## Motion (spec only)

- Hero image: slow scale 1.04 → 1 over ~18s
- Hero copy + portals: rise-in (opacity + 18px Y)
- Portal stagger: +70ms per tile
- Respect `prefers-reduced-motion: reduce`

---

## Copy lock

**Title:** AI and the Future of Employment  
**Tagline:** Who is most exposed, and how is work changing?  
**Main RQ:** How does the rapid development and adoption of Artificial Intelligence affect the transformation of the global labor market?  
**Audience intro:** This site is for students, employees, employers, policymakers, and anyone curious about how AI is transforming employment.  
**Portals:**
1. How does AI automation affect existing jobs and employment opportunities?
2. How is AI currently being used to automate or assist with workplace tasks?
3. How has AI adoption changed across industries and businesses over time?
4. What new employment opportunities and career paths are emerging from AI?

---

## Approval checklist

- [ ] Hero reads as one composition with strong title
- [ ] Research question band is single-purpose
- [ ] Audience is clear without clutter
- [ ] Four portals feel like destinations, not a dashboard
- [ ] Mobile stack is readable without horizontal squeeze
- [ ] Colors/fonts match this spec

When approved, implement against [index.html](../../index.html) and [css/style.css](../../css/style.css) only — question pages stay as-is for that pass.
