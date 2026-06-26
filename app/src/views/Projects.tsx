import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Cards from "@cloudscape-design/components/cards";
import Container from "@cloudscape-design/components/container";
import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";
import Badge from "@cloudscape-design/components/badge";
import SpaceBetween from "@cloudscape-design/components/space-between";

import { useStrings } from "../i18n";
import { useProjects } from "../data/hooks";
import type { ProjectItem } from "../data/types";
import DataBoundary from "../components/DataBoundary";

export default function Projects() {
  const t = useStrings();
  const { data, loading, error } = useProjects();

  const featured = data.find((p) => p.featured);
  const rest = data.filter((p) => !p.featured);

  return (
    <ContentLayout header={<Header variant="h1">{t.projects.title}</Header>}>
      <DataBoundary loading={loading} error={error} isEmpty={data.length === 0}>
        <SpaceBetween size="l">
          {featured ? (
            <Container
              header={
                <Header
                  variant="h2"
                  description={featured.tagline}
                  actions={
                    featured.url ? (
                      <Link href={featured.url} external variant="primary">
                        {t.projects.viewRepo}
                      </Link>
                    ) : undefined
                  }
                >
                  ⭐ {t.projects.featured} · {featured.title}
                </Header>
              }
            >
              <SpaceBetween size="m">
                <Box variant="p">{featured.description}</Box>
                {featured.badges && featured.badges.length > 0 ? (
                  <SpaceBetween size="xs" direction="horizontal">
                    {featured.badges.map((badge) => (
                      <Badge key={badge} color="green">
                        {badge}
                      </Badge>
                    ))}
                  </SpaceBetween>
                ) : null}
                {featured.results && featured.results.length > 0 ? (
                  <div>
                    <Box variant="awsui-key-label" margin={{ bottom: "xxs" }}>
                      {t.projects.results}
                    </Box>
                    <ul style={{ margin: 0, paddingInlineStart: "1.1rem" }}>
                      {featured.results.map((r) => (
                        <li key={r}>
                          <Box variant="span">{r}</Box>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {featured.stack.length > 0 ? (
                  <Box variant="small" color="text-body-secondary">
                    {t.projects.stack}: {featured.stack.join(" · ")}
                  </Box>
                ) : null}
              </SpaceBetween>
            </Container>
          ) : null}

          <Cards<ProjectItem>
            items={rest}
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
        </SpaceBetween>
      </DataBoundary>
    </ContentLayout>
  );
}
