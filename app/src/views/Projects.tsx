import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Cards from "@cloudscape-design/components/cards";
import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";

import { useStrings } from "../i18n";
import { useProjects } from "../data/hooks";
import type { ProjectItem } from "../data/types";
import DataBoundary from "../components/DataBoundary";

export default function Projects() {
  const t = useStrings();
  const { data, loading, error } = useProjects();

  return (
    <ContentLayout header={<Header variant="h1">{t.projects.title}</Header>}>
      <DataBoundary loading={loading} error={error} isEmpty={data.length === 0}>
        <Cards<ProjectItem>
          items={data}
          cardDefinition={{
            header: (item) => item.title,
            sections: [
              {
                id: "description",
                content: (item) => <Box variant="p">{item.description}</Box>,
              },
              {
                id: "stack",
                header: t.projects.stack,
                content: (item) => item.stack.join(" · "),
              },
              {
                id: "link",
                content: (item) =>
                  item.url ? (
                    <Link href={item.url} external>
                      {t.projects.viewArticle}
                    </Link>
                  ) : null,
              },
            ],
          }}
          cardsPerRow={[{ cards: 1 }, { minWidth: 600, cards: 2 }]}
          empty={
            <SpaceBetween size="xxs">
              <Box color="text-status-inactive">{t.common.empty}</Box>
            </SpaceBetween>
          }
        />
      </DataBoundary>
    </ContentLayout>
  );
}
