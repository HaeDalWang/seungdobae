import { useStrings } from "../i18n";
import { useCredly } from "../data/hooks";
import { formatDate } from "../lib/format";
import DataBoundary from "../components/DataBoundary";
import "../styles/console.css";

export default function Certifications() {
  const t = useStrings();
  const { data, loading, error } = useCredly();

  return (
    <div className="hd-scope">
      <div className="hd-pghead">
        <h1 className="hd-pgtitle">{t.certifications.title}</h1>
      </div>

      <DataBoundary loading={loading} error={error} isEmpty={data.badges.length === 0}>
        <div className="hd-certgrid">
          {data.badges.map((badge) => (
            <div className="hd-cert" key={badge.id}>
              <div className="hd-cert-head">
                {badge.imageUrl ? (
                  <img
                    className="hd-cert-img"
                    src={badge.imageUrl}
                    alt={badge.name}
                    width={64}
                    height={64}
                    loading="lazy"
                  />
                ) : null}
                <div>
                  <div className="hd-cert-name">{badge.name}</div>
                  <div className="hd-cert-meta">
                    {badge.issuer} · {formatDate(badge.issuedAt)}
                  </div>
                </div>
              </div>

              {badge.skills.length > 0 ? (
                <div className="hd-taglist">
                  {badge.skills.slice(0, 6).map((skill) => (
                    <span className="hd-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}

              {badge.url ? (
                <div className="hd-cert-foot">
                  <a className="hd-link" href={badge.url} target="_blank" rel="noreferrer">
                    {t.certifications.viewBadge}
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
