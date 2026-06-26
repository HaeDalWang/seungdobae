import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import Grid from "@cloudscape-design/components/grid";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Link from "@cloudscape-design/components/link";
import Badge from "@cloudscape-design/components/badge";

import { useStrings } from "../i18n";
import { useProfile, useGithub, useCredly, useCertifications, useProjects } from "../data/hooks";
import { calcCareerYears } from "../lib/career";
import { formatNumber, formatDate } from "../lib/format";
import KpiWidget from "../components/KpiWidget";
import DataBoundary from "../components/DataBoundary";

export default function Overview() {
  const t = useStrings();
  const profile = useProfile();
  const github = useGithub();
  const credly = useCredly();
  const certifications = useCertifications();
  const projects = useProjects();

  const loading = profile.loading || github.loading || credly.loading;
  const careerYears = calcCareerYears(profile.data.careerStartDate);
  const featured = projects.data.find((p) => p.featured);
  // 자격증 수 = Credly 자동 수집 + 수동(외부 발급) 합산.
  const certCount = credly.data.badges.length + certifications.data.length;

  // KPI 4종: 경력연차 · 누적 티켓 · 운영 클러스터 · 자격증
  // GitHub repo/star는 개발 지표라 헤드라인에서 제외, 운영 성과를 전면에 둔다.
  const kpis = [
    { value: String(careerYears), label: t.overview.careerYears, unit: t.overview.careerUnit },
    {
      value: formatNumber(profile.data.metrics.tickets),
      label: t.overview.ticketCount,
      unit: t.overview.ticketUnit,
    },
    {
      value: formatNumber(profile.data.metrics.clusters),
      label: t.overview.clusterCount,
      unit: t.overview.clusterUnit,
    },
    {
      value: formatNumber(certCount),
      label: t.overview.certCount,
      unit: t.overview.certUnit,
    },
  ];

  return (
    <ContentLayout
      header={
        <Header variant="h1" description={profile.data.title}>
          {profile.data.name || t.overview.title}
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">{t.overview.title}</Header>}>
          <DataBoundary loading={loading} error={null}>
            <Grid
              gridDefinition={[
                { colspan: { default: 6, xs: 3 } },
                { colspan: { default: 6, xs: 3 } },
                { colspan: { default: 6, xs: 3 } },
                { colspan: { default: 6, xs: 3 } },
              ]}
            >
              {kpis.map((kpi) => (
                <KpiWidget key={kpi.label} value={kpi.value} label={kpi.label} unit={kpi.unit} />
              ))}
            </Grid>
          </DataBoundary>
        </Container>

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
                ⭐ {t.overview.featuredWork} · {featured.title}
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
                    {t.overview.results}
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
                  {featured.stack.join(" · ")}
                </Box>
              ) : null}
            </SpaceBetween>
          </Container>
        ) : null}

        <Container header={<Header variant="h2">{t.overview.about}</Header>}>
          <DataBoundary
            loading={profile.loading}
            error={profile.error}
            isEmpty={profile.data.bio === ""}
          >
            <Box variant="p">{profile.data.bio}</Box>
          </DataBoundary>
        </Container>

        <Container header={<Header variant="h2">{t.overview.recentActivity}</Header>}>
          <DataBoundary
            loading={github.loading}
            error={github.error}
            isEmpty={github.data.recentRepos.length === 0}
          >
            <SpaceBetween size="s">
              {github.data.recentRepos.slice(0, 3).map((repo) => (
                <div key={repo.name}>
                  <Link href={repo.url} external>
                    {repo.name}
                  </Link>
                  <Box variant="small" color="text-body-secondary">
                    {repo.description} · {formatDate(repo.updatedAt)}
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
