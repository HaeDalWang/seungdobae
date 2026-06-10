import { useStrings } from "../i18n";
import { useProjects } from "../data/hooks";
import DataBoundary from "../components/DataBoundary";
import "../styles/console.css";

export default function Projects() {
  const t = useStrings();
  const { data, loading, error } = useProjects();

  return (
    <div className="hd-scope">
      <div className="hd-pghead">
        <h1 className="hd-pgtitle">{t.projects.title}</h1>
      </div>

      <DataBoundary loading={loading} error={error} isEmpty={data.length === 0}>
        <div className="hd-projgrid">
          {data.map((item) => (
            <div className="hd-proj" key={item.title}>
              <div className="hd-proj-title">{item.title}</div>
              <div className="hd-proj-desc">{item.description}</div>
              {item.stack.length > 0 ? (
                <div className="hd-proj-stack">{item.stack.join(" · ")}</div>
              ) : null}
              {item.url ? (
                <div className="hd-proj-foot">
                  <a className="hd-link" href={item.url} target="_blank" rel="noreferrer">
                    {t.projects.viewArticle}
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </DataBoundary>
    </div>
  );
}
