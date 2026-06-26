import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import Grid from "@cloudscape-design/components/grid";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Link from "@cloudscape-design/components/link";

import { useStrings } from "../i18n";
import { useProfile, useGithub, useCredly } from "../data/hooks";
import { calcCareerYears } from "../lib/career";
import { formatNumber, formatDate } from "../lib/format";
import KpiWidget from "../components/KpiWidget";
import DataBoundary from "../components/DataBoundary";

export default function Overview() {
  const t = useStrings();
  const profile = useProfile();
  const github = useGithub();
  const credly = useCredly();

  const loading = profile.loading || github.loading || credly.loading;
  const careerYears = calcCareerYears(profile.data.careerStartDate);

  // KPI 4종: 경력연차 · 자격증 · 저장소 · Star
  const kpis = [
    { value: String(careerYears), label: t.overview.careerYears, unit: t.overview.careerUnit },
    {
      value: formatNumber(credly.data.badges.length),
      label: t.overview.certCount,
      unit: t.overview.certUnit,
    },
    {
      value: formatNumber(github.data.repoCount),
      label: t.overview.repoCount,
      unit: t.overview.repoUnit,
    },
    {
      value: formatNumber(github.data.starCount),
      label: t.overview.starCount,
      unit: t.overview.starUnit,
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
