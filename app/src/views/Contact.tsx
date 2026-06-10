import type { ReactNode } from "react";

import { useStrings } from "../i18n";
import { useProfile } from "../data/hooks";
import ConsoleCard from "../components/ConsoleCard";
import DataBoundary from "../components/DataBoundary";
import "../styles/console.css";

interface ContactPair {
  label: string;
  value: ReactNode;
}

export default function Contact() {
  const t = useStrings();
  const { data, loading, error } = useProfile();
  const { contact } = data;

  // 채워진 항목만 노출한다.
  const items: ContactPair[] = [];
  if (contact.email) {
    items.push({
      label: t.contact.email,
      value: (
        <a className="hd-link" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
      ),
    });
  }
  if (contact.github) {
    items.push({
      label: t.contact.github,
      value: (
        <a className="hd-link" href={contact.github} target="_blank" rel="noreferrer">
          {contact.github}
        </a>
      ),
    });
  }
  if (contact.linkedin) {
    items.push({
      label: t.contact.linkedin,
      value: (
        <a className="hd-link" href={contact.linkedin} target="_blank" rel="noreferrer">
          {contact.linkedin}
        </a>
      ),
    });
  }
  if (contact.location) {
    items.push({ label: t.contact.location, value: contact.location });
  }

  return (
    <div className="hd-scope">
      <div className="hd-pghead">
        <h1 className="hd-pgtitle">{t.contact.title}</h1>
      </div>

      <ConsoleCard>
        <DataBoundary loading={loading} error={error} isEmpty={items.length === 0}>
          <div className="hd-kv">
            {items.map((item) => (
              <div className="hd-kv-row" key={item.label}>
                <span className="hd-kv-k">{item.label}</span>
                <span className="hd-kv-v">{item.value}</span>
              </div>
            ))}
          </div>
        </DataBoundary>
      </ConsoleCard>
    </div>
  );
}
