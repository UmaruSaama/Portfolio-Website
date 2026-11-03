import type { ReactNode } from "react";
import { ChapterEnd, Chapter } from "../Primitives";
import { Opener } from "./Story";
import { PixelBox, Plate } from "./Pixel";
import s from "./Ch10System.module.css";

/**
 * 10 · The system underneath (Figma 504:68574): type specimen, the ’25
 * Arcade palette, the v3 component kit and the v1 → v3 detailing pass.
 */

const IMG = "/cs/alcheringa-25/img";

/** Figma "Figure – …" (toolbar hidden): pink title plate over a dark stage. */
function Stage({
  plate,
  plateClass,
  className,
  children,
}: {
  plate: string;
  /** Sets the Figma "Title plate" box (width, text line). */
  plateClass: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className={s.fig}>
      <Plate as="figcaption" className={`${s.plate} ${plateClass}`}>
        {plate}
      </Plate>
      <PixelBox tone="dark" className={`${s.stage} ${className ?? ""}`}>
        {children}
      </PixelBox>
    </figure>
  );
}

/* ---------- colour tokens (Arcade collection, Default mode) ---------- */

type Token = { name: string; hex: string; ext?: boolean };

const base: Token[] = [
  { name: "bg/night", hex: "#1D2B53" },
  { name: "bg/raised", hex: "#7E2553" },
  { name: "bg/sunken", hex: "#111D35", ext: true },
  { name: "bg/grid", hex: "#111D35", ext: true },
  { name: "ink/outline", hex: "#000000" },
  { name: "text/primary", hex: "#FFF1E8" },
  { name: "text/secondary", hex: "#C2C3C7" },
  { name: "text/muted", hex: "#C2C3C7" },
  { name: "text/on-light", hex: "#1D2B53" },
];

const ramps: { name: string; tokens: Token[] }[] = [
  {
    name: "magenta",
    tokens: [
      { name: "magenta/300", hex: "#FF77A8" },
      { name: "magenta/500", hex: "#BE1250", ext: true },
      { name: "magenta/700", hex: "#422136", ext: true },
    ],
  },
  {
    name: "cyan",
    tokens: [
      { name: "cyan/300", hex: "#29ADFF" },
      { name: "cyan/500", hex: "#29ADFF" },
      { name: "cyan/700", hex: "#065AB5", ext: true },
    ],
  },
  {
    name: "lime",
    tokens: [
      { name: "lime/300", hex: "#A8E72E", ext: true },
      { name: "lime/500", hex: "#00E436" },
      { name: "lime/700", hex: "#008751" },
    ],
  },
  {
    name: "yellow",
    tokens: [
      { name: "yellow/300", hex: "#FFEC27" },
      { name: "yellow/500", hex: "#FFEC27" },
      { name: "yellow/700", hex: "#FFA300" },
    ],
  },
  {
    name: "orange",
    tokens: [
      { name: "orange/500", hex: "#FFA300" },
      { name: "orange/700", hex: "#AB5236" },
    ],
  },
  {
    name: "cream",
    tokens: [
      { name: "cream/500", hex: "#FFF1E8" },
      { name: "cream/700", hex: "#FFCCAA" },
    ],
  },
  {
    name: "purple",
    tokens: [
      { name: "purple/500", hex: "#754665", ext: true },
      { name: "purple/700", hex: "#49333B", ext: true },
    ],
  },
];

function Swatch({ t }: { t: Token }) {
  return (
    <li className={s.swatch}>
      <span className={s.chip} style={{ background: t.hex }} aria-hidden="true" />
      <span className={s.tokName}>
        {t.name.split("/")[0]}/<wbr />
        {t.name.split("/")[1]}
      </span>
      <span className={s.tokHex}>
        {t.hex}
        {t.ext && " +"}
      </span>
    </li>
  );
}

/* ---------- v1 → v3 screens ---------- */

const screens = [
  { label: "v1 · Activity, dev-ready", src: "system-v1-activity.png", w: 212, alt: "v1 Activity screen as handed to the developers: Events, Competitions and Stalls tabs over large Pronite cards." },
  { label: "v3 · Activity", src: "system-v3-activity.png", w: 102, alt: "v3 Activity screen: “What’s on” with day selector chips, Pronites, Proshows and Competitions today." },
  { label: "v1 · Map, dev-ready", src: "system-v1-map.png", w: 212, alt: "v1 Map screen: a plain street map with a search bar and a Library Shed location card." },
  { label: "v3 · Map", src: "system-v3-map.png", w: 213, alt: "v3 Map screen: pixel-art campus map with category filters, pins and an Athletic Field landmark card with Directions." },
];

export function Ch10System() {
  return (
    <Chapter id="system" label="The system underneath" className={s.root}>
      <div className={s.bare}>
        <Opener
          eyebrow="The system underneath"
          title="8-bit, but legible: two pixel typefaces, one job each."
          introTitle="Typography"
          intro={
            <p className={s.regular}>
              ’24 set Futura PT across the app. ’25 uses two pixel typefaces: Brick Pixel for titles, levels and
              numbers; Game Tape for everything you read, because it’s the one pixel face that survives a paragraph.
            </p>
          }
        />
      </div>

      {/* Figure – Typography */}
      <Stage plate="TYPOGRAPHY: BRICK PIXEL AND GAME TAPE" plateClass={s.plateType}>
        <p className={s.lead}>Brick Pixel for display, Game Tape for reading.</p>
        <div className={s.typeCols}>
          <div className={s.typeCol}>
            <h4 className={s.label}>Brick Pixel · display</h4>
            <p className={s.brickHero}>LEVEL UP</p>
            <p className={s.brickSet}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
              <br />
              LVL 7 · 09 MAR · 2026
            </p>
            <p className={s.typeNote}>
              Titles, level numbers, XP counts, HUD labels. Caps only; it was never asked to carry a sentence.
            </p>
            <p className={`${s.label} ${s.sizesL}`}>Sizes in use: 37 · 29 · 22</p>
          </div>
          <div className={s.typeCol}>
            <h4 className={s.label}>Game Tape · body</h4>
            <p className={s.tapeHero}>Your day starts at 6 pm with the pronite.</p>
            <p className={s.tapeSet}>ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
            <p className={s.tapePara}>
              Check in at an event, rate a stall, be first to a lineup reveal: each earns XP. XP levels you up,
              unlocks achievements and ranks you, your team and your hostel.
            </p>
            <p className={`${s.typeNote} ${s.useR}`}>Body, buttons, cards, Pixel’s dialogue.</p>
            <p className={`${s.label} ${s.sizesR}`}>Sizes in use: 28 · 21 · 14</p>
          </div>
        </div>
        <PixelBox tone="blue" className={s.plain}>
          <div className={s.plainText}>
            <h4 className={s.label}>Where it stays plain</h4>
            <p className={s.typeNote}>
              Money and entry are set in the body face at 21 or larger, never in Brick Pixel. Reading a price or a
              pass at a gate is not the moment for identity.
            </p>
          </div>
          <div className={s.plainDo}>
            <p className={s.price}>₹ 2,499</p>
            <p className={s.pass}>Pass · Row A · 6:00 pm</p>
          </div>
          <div className={s.plainDont}>
            <p className={s.priceBrick}>₹ 2,499</p>
            <p className={s.notThis}>not this</p>
          </div>
        </PixelBox>
        <p className={s.foot}>
          Type scale read off the v3 screens. Both faces are loaded in the app; Hanken Grotesk is only this case
          study’s voice.
        </p>
      </Stage>

      {/* Section – Color */}
      <section className={s.section} aria-labelledby="system-colour">
        <div className={`${s.secHead} ${s.secHeadColour}`}>
          <h3 id="system-colour" className={s.secTitle}>
            Colour
          </h3>
          <p className={s.secBody}>
            ’24’s palette came from its theme, Chromatic Elysium. ’25’s is <span className={s.nowrap}>PICO-8:</span> the 16-colour palette of a fantasy
            console, limited the way 8-bit hardware was limited. One colour marks what’s live, one marks what’s
            yours. Merch stays in photographs: nobody buys a hoodie from a sprite.
          </p>
        </div>
        {/* Brick Pixel has no ’ glyph; Figma draws a straight tick there, so use ' */}
        <Stage plate="THE '25 PALETTE" plateClass={s.platePalette} className={s.colourStage}>
          <p className={`${s.lead} ${s.lead135}`}>
            PICO-8 underneath, extended where the fest needed it: 27 tokens in one Arcade collection.
          </p>
          <h4 className={`${s.label} ${s.palLabel}`}>Backgrounds, ink and text</h4>
          <ul className={s.baseRow}>
            {base.map((t) => (
              <Swatch key={t.name} t={t} />
            ))}
          </ul>
          <h4 className={`${s.label} ${s.rampLabel}`}>Accent ramps</h4>
          <div className={s.ramps}>
            {ramps.map((r) => (
              <ul key={r.name} className={s.ramp} aria-label={`${r.name} ramp`}>
                {r.tokens.map((t) => (
                  <Swatch key={t.name} t={t} />
                ))}
              </ul>
            ))}
          </div>
          <p className={`${s.label} ${s.extNote}`}>
            + extended beyond the 16 PICO-8 colours: eight tokens, seven values. The rest are the console’s own.
          </p>
          <p className={s.foot}>
            Tokens read from the app file’s Arcade variable collection (Default mode). Four pairs share a value:
            bg/grid = bg/sunken, text/muted = text/secondary, cyan/300 = cyan/500, yellow/300 = yellow/500.
          </p>
        </Stage>
      </section>

      {/* Section – Components */}
      <section className={s.section} aria-labelledby="system-components">
        <div className={s.secHead}>
          <h3 id="system-components" className={s.secTitle}>
            Components
          </h3>
          <p className={s.secBody}>
            RPG dialogue boxes for Pixel the mascot, a HUD for XP, level and countdowns, title plates, ticket passes
            and a mystery card for reveals. Each component is drawn as one vector per colour, so it scales without
            blur, and the ones that carry money or entry (payment, QR, prices) stay plain.
          </p>
        </div>
        <Stage plate="CORE COMPONENTS" plateClass={s.plateKit}>
          <p className={`${s.lead} ${s.lead135}`}>One kit, one 8-bit grammar. Payment, QR and prices stay plain.</p>
          <div className={s.kit}>
            <h4 className={`${s.label} ${s.kitLabel}`} style={{ gridColumn: 1 }}>
              Cards
            </h4>
            <h4 className={`${s.label} ${s.kitLabel}`} style={{ gridColumn: 3 }}>
              HUD and overlays
            </h4>
            <h4 className={`${s.label} ${s.kitLabel} ${s.kitInset}`} style={{ gridColumn: 4 }}>
              Controls and game
            </h4>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={s.kitImg}
              style={{ gridColumn: 1 }}
              src={`${IMG}/system-kit-cards.png`}
              alt="Cards from the v3 kit: an event card for 3-on-3 Basketball, a Night 1 ticket pass with a QR code, and a “Crazy Eyes Hoodie” title plate with a star rating."
              width={292}
              height={456}
              loading="lazy"
              decoding="async"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={s.kitImg}
              style={{ gridColumn: 3 }}
              src={`${IMG}/system-kit-hud.png`}
              alt="HUD and overlays: level 3 badge, 1,250 XP counter, ₹ 5,000 prize tag, Live now indicator, a 12:08:45:09 countdown, Pixel’s speech bubble “Wield: Powerful merch!” and an “Added to cart!” toast."
              width={318}
              height={456}
              loading="lazy"
              decoding="async"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={s.kitImg}
              style={{ gridColumn: 4 }}
              src={`${IMG}/system-kit-controls.png`}
              alt="Controls and game: green and blue “Play now” buttons, Home nav items, a locked mystery card, Day 1 tags in four tones, Music filter chips and two Night owl achievement tiles."
              width={294}
              height={456}
              loading="lazy"
              decoding="async"
            />
            <p className={`${s.foot} ${s.kitCap}`} style={{ gridColumn: 1 }}>
              Event card · Ticket pass · Title plate
            </p>
            <p className={`${s.foot} ${s.kitCap} ${s.kitCapHud}`} style={{ gridColumn: 3 }}>
              Level badge · Resource counter · Prize tag · Live · Countdown · Pixel’s speech bubble · Toast
            </p>
            <p className={`${s.foot} ${s.kitCap} ${s.kitInset}`} style={{ gridColumn: 4 }}>
              Buttons · Nav items · Mystery card · Tags · Filter chips · Achievement tiles
            </p>
          </div>
          <p className={s.foot}>
            Live instances of the v3 library. Each glyph is one vector per colour, so it scales without blur. 20 button
            variants, 3 mystery-card states, 4 tag tones.
          </p>
        </Stage>
      </section>

      {/* Figure – v1 to v3 */}
      <Stage plate="FROM DEV-READY TO FINAL: THE DETAILING PASS" plateClass={s.platePass} className={s.passStage}>
        <p className={s.lead}>
          v1 went to the developers first. The detailing pass gave Activity its days and Map its filters and landmark
          card, without moving anything attendees had already learned.
        </p>
        <div className={s.pass2}>
          {screens.map((sc, i) => {
            const col = i * 2 + 1;
            return (
              <div key={sc.src} className={s.screen} style={{ gridColumn: col }}>
                <p className={s.screenLabel}>{sc.label}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={s.screenImg}
                  src={`${IMG}/${sc.src}`}
                  alt={sc.alt}
                  width={sc.w}
                  height={460}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            );
          })}
          <span className={s.arrow} style={{ gridColumn: 2 }} aria-hidden="true">
            <span className={s.arrowGlyph}>→</span>
          </span>
          <span className={s.arrow} style={{ gridColumn: 6 }} aria-hidden="true">
            <span className={s.arrowGlyph}>→</span>
          </span>
        </div>
        <p className={s.foot}>
          v1 is the build handed to the developers; v3 is the final. Both are &apos;25 team work.
        </p>
      </Stage>

      <ChapterEnd>What’s left is what I’d do next.</ChapterEnd>
    </Chapter>
  );
}
