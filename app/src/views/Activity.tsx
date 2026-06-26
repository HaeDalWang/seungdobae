import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import Grid from "@cloudscape-design/components/grid";
import Table from "@cloudscape-design/components/table";
import PieChart from "@cloudscape-design/components/pie-chart";
import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";

import { useStrings } from "../i18n";
import { useGithub, useBlog } from "../data/hooks";
import type { GithubRepo } from "../data/types";
import { formatDate, formatNumber } from "../lib/format";
import DataBoundary from "../components/DataBoundary";

export default function Activity() {
  const t = useStrings();
  const github = useGithub();
  const blog = useBlog();

  const languageSegments = github.data.languages.map((lang) => ({
    title: lang.name,
    value: lang.count,
  }));

  return (
    <ContentLayout header={<Header variant="h1">{t.activity.title}</Header>}>
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
                    key: "비율",
                    value: `${((datum.value / sum) * 100).toFixed(0)}%`,
                  },
                ]}
                ariaLabel={t.activity.languages}
                empty={<Box color="text-status-inactive">{t.common.empty}</Box>}
              />
            </DataBoundary>
          </Container>
        </Grid>

        <Container header={<Header variant="h2">{t.activity.blog}</Header>}>
          <DataBoundary
            loading={blog.loading}
            error={blog.error}
            isEmpty={blog.data.posts.length === 0}
          >
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
      </SpaceBetween>
    </ContentLayout>
  );
}
