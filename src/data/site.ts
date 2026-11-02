// Site-wide content. Values marked TODO are placeholders until confirmed.

export const site = {
  name: "Shivam",
  tagline: "I design experiences that feel simple",
  // From the CV (Website page, Placement-Portfolio)
  linkedin: "https://www.linkedin.com/in/shivam-umaru/",
  contact: "mailto:shivam.bdes@iitg.ac.in",
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
