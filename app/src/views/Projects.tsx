import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Cards from "@cloudscape-design/components/cards";
import Container from "@cloudscape-design/components/container";
import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";
import Badge from "@cloudscape-design/components/badge";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Grid from "@cloudscape-design/components/grid";
import Table from "@cloudscape-design/components/table";
import PieChart from "@cloudscape-design/components/pie-chart";

import { useStrings } from "../i18n";
import { useProjects, useGithub, useBlog } from "../data/hooks";
import type { GithubRepo, ProjectItem } from "../data/types";
import { isGithubUrl } from "../lib/link";
import { formatDate, formatNumber } from "../lib/format";
import DataBoundary from "../components/DataBoundary";

export default function Projects() {
  const t = useStrings();
  const { data, loading, error } = useProjects();

  const featured = data.find((p) => p.featured);
  const rest = data.filter((p) => !p.featured);

  return (
    <ContentLayout header={<Header variant="h1">{t.projects.title}</Header>}>
      <SpaceBetween size="l">
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
                    {t.projects.featured} · {featured.title}
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
                          {isGithubUrl(item.url) ? t.projects.viewRepo : t.projects.viewArticle}
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
        <GithubActivity />
      </SpaceBetween>
    </ContentLayout>
  );
}

/** 옛 활동 탭의 GitHub 저장소·언어 분포. 블로그는 글이 있을 때만 그린다. */
function GithubActivity() {
  const t = useStrings();
  const github = useGithub();
  const blog = useBlog();

  const languageSegments = github.data.languages.map((lang) => ({
    title: lang.name,
    value: lang.count,
  }));

  return (
    <SpaceBetween size="l">
      <Grid
        gridDefinition={[
          { colspan: { default: 12, m: 8 } },
          { colspan: { default: 12, m: 4 } },
        ]}
      >
        <Container header={<Header variant="h2">{t.activity.recentRepos}</Header>}>
          <DataBoundary
            loading={github.loading}
            error={github.error}
            isEmpty={github.data.recentRepos.length === 0}
          >
            <Table<GithubRepo>
              variant="embedded"
              items={github.data.recentRepos}
              columnDefinitions={[
                {
                  id: "name",
                  header: t.activity.repoName,
                  cell: (repo) => (
                    <Link href={repo.url} external>
                      {repo.name}
                    </Link>
                  ),
                },
                {
                  id: "language",
                  header: t.activity.repoLang,
                  cell: (repo) => repo.language ?? "—",
                },
                {
                  id: "stars",
                  header: t.activity.repoStars,
                  cell: (repo) => formatNumber(repo.stars),
                },
                {
                  id: "updated",
                  header: t.activity.repoUpdated,
                  cell: (repo) => formatDate(repo.updatedAt),
                },
              ]}
              empty={<Box color="text-status-inactive">{t.common.empty}</Box>}
            />
          </DataBoundary>
        </Container>

        <Container header={<Header variant="h2">{t.activity.languages}</Header>}>
          <DataBoundary
            loading={github.loading}
            error={github.error}
            isEmpty={languageSegments.length === 0}
          >
            <PieChart
              data={languageSegments}
              size="medium"
              hideFilter
              detailPopoverContent={(datum, sum) => [
                { key: t.activity.repoName, value: String(datum.value) },
                {
                  key: t.activity.share,
                  value: `${((datum.value / sum) * 100).toFixed(0)}%`,
                },
              ]}
              ariaLabel={t.activity.languages}
              empty={<Box color="text-status-inactive">{t.common.empty}</Box>}
            />
          </DataBoundary>
        </Container>
      </Grid>

      {/* 블로그 글이 있을 때만 섹션을 노출한다. 빈 위젯은 미완성 인상을 주므로 아예 그리지 않는다. */}
      {blog.data.posts.length > 0 ? (
        <Container header={<Header variant="h2">{t.activity.blog}</Header>}>
          <DataBoundary loading={blog.loading} error={blog.error}>
            <SpaceBetween size="s">
              {blog.data.posts.map((post) => (
                <div key={post.url}>
                  <Link href={post.url} external>
                    {post.title}
                  </Link>
                  <Box variant="small" color="text-body-secondary">
                    {formatDate(post.publishedAt)}
                  </Box>
                </div>
              ))}
            </SpaceBetween>
          </DataBoundary>
        </Container>
      ) : null}
    </SpaceBetween>
  );
}
