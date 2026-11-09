// Small stroke icons drawn on a 16px grid so they sit optically centred in
// the 44px action discs. Stroke width matches the condensed type weight.

export function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
      <path
        d="M1 2.2v11.6a1.2 1.2 0 0 0 1.8 1l10-5.8a1.2 1.2 0 0 0 0-2l-10-5.8A1.2 1.2 0 0 0 1 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
      <rect x="1.5" y="1.5" width="3.6" height="13" rx="1.2" fill="currentColor" />
      <rect x="8.9" y="1.5" width="3.6" height="13" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export function SoundIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
      <path d="M2 5.6h2.6L8.4 2.4v11.2L4.6 10.4H2a.8.8 0 0 1-.8-.8V6.4a.8.8 0 0 1 .8-.8Z" fill="currentColor" />
      <path
        d="M11.4 5.2a3.8 3.8 0 0 1 0 5.6M13.6 3a6.9 6.9 0 0 1 0 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MutedIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
      <path d="M2 5.6h2.6L8.4 2.4v11.2L4.6 10.4H2a.8.8 0 0 1-.8-.8V6.4a.8.8 0 0 1 .8-.8Z" fill="currentColor" />
      <path d="m11.6 5.6 4.8 4.8M16.4 5.6l-4.8 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13 8H3.5M7.5 3.5 3 8l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
