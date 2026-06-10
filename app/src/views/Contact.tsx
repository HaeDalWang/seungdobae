import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs";
import Link from "@cloudscape-design/components/link";

import { useStrings } from "../i18n";
import { useProfile } from "../data/hooks";
import DataBoundary from "../components/DataBoundary";

interface ContactPair {
  label: string;
  value: React.ReactNode;
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
      value: <Link href={`mailto:${contact.email}`}>{contact.email}</Link>,
    });
  }
  if (contact.github) {
    items.push({
      label: t.contact.github,
      value: (
        <Link href={contact.github} external>
          {contact.github}
        </Link>
      ),
    });
  }
  if (contact.linkedin) {
    items.push({
      label: t.contact.linkedin,
      value: (
        <Link href={contact.linkedin} external>
          {contact.linkedin}
        </Link>
      ),
    });
  }
  if (contact.location) {
    items.push({ label: t.contact.location, value: contact.location });
  }

  return (
    <ContentLayout header={<Header variant="h1">{t.contact.title}</Header>}>
      <Container>
        <DataBoundary loading={loading} error={error} isEmpty={items.length === 0}>
          <KeyValuePairs columns={2} items={items} />
        </DataBoundary>
      </Container>
    </ContentLayout>
  );
}
