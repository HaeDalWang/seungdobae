import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";

import { useStrings } from "../i18n";
import { useExperience } from "../data/hooks";
import { formatYearMonth } from "../lib/format";
import DataBoundary from "../components/DataBoundary";

export default function Experience() {
  const t = useStrings();
  const { data, loading, error } = useExperience();

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
        </SpaceBetween>
      </DataBoundary>
    </ContentLayout>
  );
}
