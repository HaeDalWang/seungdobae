import type { ContactInfo } from "../data/types";

export interface ContactLink {
  key: "github" | "linkedin" | "email";
  href: string;
  external: boolean;
}

/** 값이 채워진 연락 수단만 링크로 만든다 (상단바·개요 히어로 공용). */
export function contactLinks(contact: ContactInfo): ContactLink[] {
  const links: ContactLink[] = [];
  if (contact.github) links.push({ key: "github", href: contact.github, external: true });
  if (contact.linkedin) links.push({ key: "linkedin", href: contact.linkedin, external: true });
  if (contact.email) links.push({ key: "email", href: `mailto:${contact.email}`, external: false });
  return links;
}
