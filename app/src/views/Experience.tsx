import { useStrings } from "../i18n";
import { useExperience } from "../data/hooks";
import { formatYearMonth } from "../lib/format";
import ConsoleCard from "../components/ConsoleCard";
import DataBoundary from "../components/DataBoundary";
import "../styles/console.css";

export default function Experience() {
  const t = useStrings();
  const { data, loading, error } = useExperience();

  return (
    <div className="hd-scope">
      <div className="hd-pghead">
        <h1 className="hd-pgtitle">{t.experience.title}</h1>
      </div>

      <DataBoundary loading={loading} error={error} isEmpty={data.length === 0}>
        <div className="hd-stack">
          {data.map((item, index) => {
            const period = `${formatYearMonth(item.startDate)} – ${
              item.endDate ? formatYearMonth(item.endDate) : t.experience.present
            }`;
            return (
              <ConsoleCard key={`${item.company}-${index}`}>
                <div className="hd-tl-item">
                  <div className="hd-tl-role">
                    {item.role} · {item.company}
                  </div>
                  <div className="hd-tl-period">{period}</div>
                  <ul className="hd-tl-list">
                    {item.highlights.map((highlight, hi) => (
                      <li key={hi}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </ConsoleCard>
            );
          })}
        </div>
      </DataBoundary>
    </div>
  );
}
