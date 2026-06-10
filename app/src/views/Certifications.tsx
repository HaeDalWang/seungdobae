import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Cards from "@cloudscape-design/components/cards";
import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";

import { useStrings } from "../i18n";
import { useCredly } from "../data/hooks";
import type { CredlyBadge } from "../data/types";
import { formatDate } from "../lib/format";
import DataBoundary from "../components/DataBoundary";

const BADGE_IMAGE_SIZE = 80;

export default function Certifications() {
  const t = useStrings();
  const { data, loading, error } = useCredly();

  return (
    <ContentLayout header={<Header variant="h1">{t.certifications.title}</Header>}>
      <DataBoundary loading={loading} error={error} isEmpty={data.badges.length === 0}>
        <Cards<CredlyBadge>
          items={data.badges}
          cardDefinition={{
            header: (badge) => (
              <SpaceBetween direction="horizontal" size="s" alignItems="center">
                {badge.imageUrl ? (
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    width={BADGE_IMAGE_SIZE}
                    height={BADGE_IMAGE_SIZE}
                    loading="lazy"
                  />
                ) : null}
                <Box variant="span">{badge.name}</Box>
              </SpaceBetween>
            ),
            sections: [
              {
                id: "issuer",
                header: t.certifications.issuedBy,
                content: (badge) => badge.issuer,
              },
              {
                id: "issuedAt",
                header: t.certifications.issuedAt,
                content: (badge) => formatDate(badge.issuedAt),
              },
              {
                id: "skills",
                header: t.certifications.skills,
                content: (badge) =>
                  badge.skills.length > 0 ? badge.skills.join(" · ") : "—",
              },
              {
                id: "link",
                content: (badge) =>
                  badge.url ? (
                    <Link href={badge.url} external>
                      {t.certifications.viewBadge}
                    </Link>
                  ) : null,
              },
            ],
          }}
          cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 900, cards: 3 }]}
          empty={<Box color="text-status-inactive">{t.common.empty}</Box>}
        />
      </DataBoundary>
    </ContentLayout>
  );
}
