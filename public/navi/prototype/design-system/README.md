# Design system (Airbnb DNA): Navi late-night check-in prototype

Open `index.html` through the local server (`navi-prototype` in `.claude/launch.json`, port 5173). Opening it straight from disk doesn't load the CSS.

## What it is
A small, coded design system that matches the **visual DNA** of the Airbnb iOS app. **It isn't Airbnb's real Design Language System**, which is private. Values were matched by eye to these Airbnb iOS screens on Mobbin (captured 20 Nov 2026):
- Reservation details: https://mobbin.com/screens/f820bfa1-77a5-4adc-bc47-aa22ab860c1b
- Trip itinerary (Trips tab): https://mobbin.com/screens/f062fe34-de67-40e2-9658-3920dfc8d890
- Pending reservation + check-in/checkout card: https://mobbin.com/screens/eba2815a-8ded-4352-a19c-f0da3352df29
- "Are you sure?" bottom sheet with host local time: https://mobbin.com/screens/c8fa3a80-384a-4092-961b-6fd367fe969e
- Message thread with host: https://mobbin.com/screens/e4d0a5f6-335f-46cc-8d78-504b77fcc308
- Get help: https://mobbin.com/screens/efc6dd43-e62a-45f4-a831-1a0063ab7814
- Airbnb Support chat with quick options: https://mobbin.com/screens/4f3b5086-fd62-47b8-a590-54d918c36ef8

## Declared substitutions (say these in the case study)
| Airbnb | Here | Why |
|---|---|---|
| Airbnb Cereal | Figtree (Google Fonts) | Cereal isn't licensed for public use; Figtree has a similar geometric, friendly shape |
| Airbnb icon set | Lucide 0.469.0 | Similar 1.5–2px line style; open licence |
| Airbnb's 3D icons (2025 app) | 8 original 3D icons generated locally (FLUX.2 Klein + BiRefNet cutout) in a similar soft-3D style: `assets/icons3d/` | Airbnb's own 3D art is proprietary. Ours are original objects (gate, door, empty chair, bed, map pin, open door, key, beacon) |
| Real listing and host photos | AI-generated photos (FLUX.2 Klein): `assets/photos/` (gate at night, flat door, living room) | Placeholders for what the **host would upload in the arrival plan**. Disclose them as generated in the case study |
| Type scale | Measured against Mobbin's Reservation details screen: page title 22/600, section 18–20/600, body 16 | v1 used 26px bold titles, which was too heavy next to the real app |

`assets/ref/` holds Mobbin screenshots and the font test, **for internal comparison only. Don't publish or submit this folder.**

## Files
- `tokens.css`: colour, type, spacing, radius, elevation, touch, motion. Light and dark themes.
- `components.css`: the components below.
- `ds.js`: prototype conditions (network, battery, time, theme) applied as data-attributes on `.device`. Also opens and closes sheets and shows toasts. Screens can listen for the `ds:change` event.
- `index.html`: gallery with six phones and the conditions panel.

## Components
- Device frame and status bar
- Navigation header and pill button
- Buttons: brand, primary, secondary, outline, text; loading and disabled states; "needs network" variants
- List rows and key/value pairs
- Cards: elevated, outlined, filled, trip summary, check-in/checkout split
- Callouts: info, success, warning, error, offline; plain or tinted
- System banners: offline, SMS only, weak connection, low battery
- Badges and chips
- Avatar with status dot
- Large code display
- Itinerary timeline
- Step tracker: done, failed, active, pending
- Tab bar
- Bottom sheet
- Host local-time note
- Chat: in/out bubbles, failed message, SMS variant, system note, quick-reply options, composer
- Fields with an error state
- Toast, skeleton, empty state, sticky footer, map placeholder

## Degraded-state rules
- **Network-dependent controls:**
  - `data-needs="data"` goes grey when the network is `sms` or `offline`.
  - `data-needs="cell"` goes grey only when `offline`.
  - Each greyed control shows a `.c-needs-note` that says why.
- **Low battery:** at 20% or below, the battery banner appears and the status bar battery turns red.
- **Night use:** primary night actions use `c-btn--lg`, which is 52px tall. Dark theme is available.

## Accessibility notes
- Muted text (#6A6A6A) on white: 5.3:1.
- Rausch (#FF385C) is never used for small text. `--brand-text` (#D70466) is used instead.
- White text on the brand gradient: the lightest stop (#E61E4D) measures 4.51:1, so it passes AA. Warning (#945600) and success (#00760A) were darkened so their text passes AA on their tinted backgrounds.
- The focus ring is a 2px ink outline.
- Reduced motion is respected.

## Not decided here (on purpose)
The gallery's demo content is neutral. Which components the solution uses, the escalation steps, and who acts when are the designer's decisions (Phases 2–4). They are not built into the design system.
