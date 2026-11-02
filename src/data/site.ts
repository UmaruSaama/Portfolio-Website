// Site-wide content. Values marked TODO are placeholders until confirmed.

export const site = {
  name: "Shivam",
  tagline: "I design experiences that feel simple",
  // TODO: real LinkedIn profile URL
  linkedin: "https://www.linkedin.com/",
  // TODO: real contact address
  contact: "mailto:hello@example.com",
};

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const nav: NavItem[] = [
  { label: "Work", href: "/" },
  { label: "Motion", href: "/motion" },
  { label: "Archive", href: "/archive" },
  { label: "About", href: "/about" },
  { label: "LinkedIn", href: site.linkedin, external: true },
  { label: "Contact", href: site.contact, external: true },
];
