import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Badge from "@cloudscape-design/components/badge";
import StatusIndicator, { type StatusIndicatorProps } from "@cloudscape-design/components/status-indicator";

import { useStrings } from "../i18n";
import { useExperience, useCredly, useCertifications, useProfile } from "../data/hooks";
import { formatYearMonth } from "../lib/format";
import { buildTimeline, formatTimelineDate, type TimelineEvent, type TimelineKind } from "../lib/timeline";
import DataBoundary from "../components/DataBoundary";

/** 자격증은 제3자 검증 사실이라 success, 나머지는 info로 구분한다. */
const KIND_STATUS: Record<TimelineKind, StatusIndicatorProps.Type> = {
  current: "info",
  milestone: "info",
  join: "info",
  cert: "success",
  lecture: "info",
};

export default function Experience() {
  const t = useStrings();
  const { data, loading, error } = useExperience();
  const credly = useCredly();
  const certifications = useCertifications();
  const profile = useProfile();

  const timelineLoading = loading || credly.loading || certifications.loading || profile.loading;
  const timeline = buildTimeline({
    experience: data,
    certs: [...credly.data.badges, ...certifications.data],
    lectureYears: (profile.data.metrics.lectures?.sessions ?? []).map((s) => s.year),
  });
  const kindLabel: Record<TimelineKind, string> = {
    current: t.experience.timelineCurrent,
    milestone: t.experience.timelineMilestone,
    join: t.experience.timelineJoin,
    cert: t.experience.timelineCert,
    lecture: t.experience.timelineLecture,
  };
  const describe = (e: TimelineEvent) => (e.label ? `${kindLabel[e.kind]} · ${e.label}` : kindLabel[e.kind]);
  const currentEvents = timeline.filter((e) => e.kind === "current");
  const pastEvents = timeline.filter((e) => e.kind !== "current");
  const years = [...new Set(pastEvents.map((e) => e.date.slice(0, 4)))];
  /** milestone·current는 제목을 굵게, detail을 보조 텍스트로 보여준다. */
  const renderEvent = (e: TimelineEvent) => {
    const date = e.kind === "current" ? t.experience.present : formatTimelineDate(e.date);
    const isCareer = e.kind === "milestone" || e.kind === "current";
    return (
      <div key={`${e.kind}-${e.date}-${e.label}`}>
        <StatusIndicator type={KIND_STATUS[e.kind]}>
          {e.kind === "current" ? (
            <Badge color="blue">{date}</Badge>
          ) : (
            <Box variant="span" color="text-body-secondary">
              {date}
            </Box>
          )}{" "}
          {isCareer ? <Box variant="strong">{e.label}</Box> : describe(e)}
        </StatusIndicator>
        {isCareer && e.detail ? (
          <Box variant="small" display="block" color="text-body-secondary" padding={{ left: "l" }}>
            {e.detail}
          </Box>
        ) : null}
      </div>
    );
  };

  return (
    <ContentLayout header={<Header variant="h1">{t.experience.title}</Header>}>
      <DataBoundary loading={loading} error={error} isEmpty={data.length === 0}>
        <SpaceBetween size="l">
          {data.map((item, index) => {
            const period = `${formatYearMonth(item.startDate)} – ${
              item.endDate ? formatYearMonth(item.endDate) : t.experience.present
            }`;
            return (
              <Container
                key={`${item.company}-${index}`}
                header={
                  <Header variant="h2" description={period}>
                    {item.role} · {item.company}
                  </Header>
                }
              >
                <ul>
                  {item.highlights.map((highlight, hi) => (
                    <li key={hi}>
                      <Box variant="span">{highlight}</Box>
                    </li>
                  ))}
                </ul>
              </Container>
            );
          })}

          {/* 날짜가 있는 사건이 하나도 없으면 빈 칸을 그리지 않는다. 다른 데이터 로딩 중에는 순서가 바뀌지 않도록 기다린다. */}
          {!timelineLoading && timeline.length > 0 ? (
            <Container
              header={
                <Header variant="h2" description={t.experience.timelineDescription}>
                  {t.experience.timelineTitle}
                </Header>
              }
            >
              <SpaceBetween size="m">
                {currentEvents.map(renderEvent)}
                {years.map((year) => (
                  <div key={year}>
                    <Box variant="awsui-key-label" margin={{ bottom: "xxs" }}>
                      {year}
                    </Box>
                    <SpaceBetween size="xxs">{pastEvents.filter((e) => e.date.startsWith(year)).map(renderEvent)}</SpaceBetween>
                  </div>
                ))}
              </SpaceBetween>
            </Container>
          ) : null}
        </SpaceBetween>
      </DataBoundary>
    </ContentLayout>
  );
}
