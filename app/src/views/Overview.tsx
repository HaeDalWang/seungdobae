import { useStrings } from "../i18n";
import { useProfile, useGithub, useCredly } from "../data/hooks";
import { calcCareerYears } from "../lib/career";
import { formatNumber, formatDate } from "../lib/format";
import MetricCard from "../components/MetricCard";
import ConsoleCard from "../components/ConsoleCard";
import DataBoundary from "../components/DataBoundary";
import "../styles/console.css";

export default function Overview() {
  const t = useStrings();
  const profile = useProfile();
  const github = useGithub();
  const credly = useCredly();

  const loading = profile.loading || github.loading || credly.loading;
  const careerYears = calcCareerYears(profile.data.careerStartDate);

  // KPI 4종: 경력연차 · 자격증 · 저장소 · Star. 각 바는 핸드오프 강조 색상.
  const kpis = [
    {
      value: String(careerYears),
      label: t.overview.careerYears,
      unit: t.overview.careerUnit,
      barColor: "var(--hd-ok)",
      barPercent: 70,
    },
    {
      value: formatNumber(credly.data.badges.length),
      label: t.overview.certCount,
      unit: t.overview.certUnit,
      barColor: "var(--hd-terr)",
      barPercent: 45,
    },
    {
      value: formatNumber(github.data.repoCount),
      label: t.overview.repoCount,
      unit: t.overview.repoUnit,
      barColor: "var(--hd-must)",
      barPercent: 60,
    },
    {
      value: formatNumber(github.data.starCount),
      label: t.overview.starCount,
      unit: t.overview.starUnit,
      barColor: "var(--hd-navy)",
      barPercent: 30,
    },
  ];

  return (
    <div className="hd-scope">
      <div className="hd-pghead">
        <div>
          <h1 className="hd-pgtitle">{profile.data.name || t.overview.title}</h1>
          <div className="hd-pgsub">{profile.data.title}</div>
        </div>
      </div>

      <div className="hd-stack">
        <DataBoundary loading={loading} error={null}>
          <div className="hd-metrics">
            {kpis.map((kpi) => (
              <MetricCard
                key={kpi.label}
                value={kpi.value}
                label={kpi.label}
                unit={kpi.unit}
                barColor={kpi.barColor}
                barPercent={kpi.barPercent}
              />
            ))}
          </div>
        </DataBoundary>

        <ConsoleCard title={t.overview.about}>
          <DataBoundary
            loading={profile.loading}
            error={profile.error}
            isEmpty={profile.data.bio === ""}
          >
            <p style={{ margin: 0, color: "var(--hd-t2)", lineHeight: 1.65 }}>
              {profile.data.bio}
            </p>
          </DataBoundary>
        </ConsoleCard>

        <ConsoleCard title={t.overview.recentActivity}>
          <DataBoundary
            loading={github.loading}
            error={github.error}
            isEmpty={github.data.recentRepos.length === 0}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {github.data.recentRepos.slice(0, 3).map((repo) => (
                <div key={repo.name}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hd-link"
                  >
                    {repo.name}
                  </a>
                  <div
                    style={{ fontSize: 12, color: "var(--hd-t3)", marginTop: 2 }}
                  >
                    {repo.description} · {formatDate(repo.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          </DataBoundary>
        </ConsoleCard>
      </div>
    </div>
  );
}
