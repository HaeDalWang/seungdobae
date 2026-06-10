import { useState } from "react";

import { useStrings } from "../i18n";
import { useGithub, useBlog } from "../data/hooks";
import { formatDate, formatNumber } from "../lib/format";
import ConsoleCard from "../components/ConsoleCard";
import LanguageDonut from "../components/LanguageDonut";
import DataBoundary from "../components/DataBoundary";
import "../styles/console.css";

// 언어 막대/도넛 색상 — 핸드오프 강조 팔레트를 순환 적용한다.
const LANG_COLORS = [
  "var(--hd-terr)",
  "var(--hd-must)",
  "var(--hd-navy)",
  "var(--hd-ok)",
  "var(--hd-info)",
];

type LangView = "bar" | "donut";

const iconBar = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <rect x="1" y="7" width="3" height="6" rx="0.5" />
    <rect x="5.5" y="3" width="3" height="10" rx="0.5" />
    <rect x="10" y="5" width="3" height="8" rx="0.5" />
  </svg>
);

const iconDonut = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    aria-hidden="true"
  >
    <circle cx="7" cy="7" r="5" />
  </svg>
);

export default function Activity() {
  const t = useStrings();
  const github = useGithub();
  const blog = useBlog();
  const [langView, setLangView] = useState<LangView>("bar");

  const languages = github.data.languages;
  const langMax = languages.reduce((max, lang) => Math.max(max, lang.count), 0);

  const langToggle = (
    <div className="hd-seg" role="group" aria-label={t.activity.langViewToggle}>
      <button
        type="button"
        className={langView === "bar" ? "hd-seg-btn on" : "hd-seg-btn"}
        aria-pressed={langView === "bar"}
        aria-label={t.activity.langViewBar}
        onClick={() => setLangView("bar")}
      >
        {iconBar}
      </button>
      <button
        type="button"
        className={langView === "donut" ? "hd-seg-btn on" : "hd-seg-btn"}
        aria-pressed={langView === "donut"}
        aria-label={t.activity.langViewDonut}
        onClick={() => setLangView("donut")}
      >
        {iconDonut}
      </button>
    </div>
  );

  return (
    <div className="hd-scope">
      <div className="hd-pghead">
        <h1 className="hd-pgtitle">{t.activity.title}</h1>
      </div>

      <div className="hd-stack">
        <ConsoleCard title={t.activity.recentRepos} flushBody>
          <DataBoundary
            loading={github.loading}
            error={github.error}
            isEmpty={github.data.recentRepos.length === 0}
          >
            <div className="hd-table-wrap">
              <table className="hd-dt">
                <thead>
                  <tr>
                    <th>{t.activity.repoName}</th>
                    <th>{t.activity.repoLang}</th>
                    <th>{t.activity.repoStars}</th>
                    <th>{t.activity.repoUpdated}</th>
                  </tr>
                </thead>
                <tbody>
                  {github.data.recentRepos.map((repo) => (
                    <tr key={repo.name}>
                      <td>
                        <a
                          className="hd-link"
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {repo.name}
                        </a>
                      </td>
                      <td>{repo.language ?? "—"}</td>
                      <td>{formatNumber(repo.stars)}</td>
                      <td>{formatDate(repo.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataBoundary>
        </ConsoleCard>

        <ConsoleCard title={t.activity.languages} actions={langToggle}>
          <DataBoundary
            loading={github.loading}
            error={github.error}
            isEmpty={languages.length === 0}
          >
            {langView === "donut" ? (
              <LanguageDonut languages={languages} colors={LANG_COLORS} />
            ) : (
              <div className="hd-langbar">
                {languages.map((lang, i) => (
                  <div className="hd-langbar-row" key={lang.name}>
                    <div className="hd-langbar-head">
                      <span>{lang.name}</span>
                      <span>{formatNumber(lang.count)}</span>
                    </div>
                    <div className="hd-langbar-track">
                      <div
                        className="hd-langbar-fill"
                        style={{
                          width: langMax > 0 ? `${(lang.count / langMax) * 100}%` : "0%",
                          background: LANG_COLORS[i % LANG_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DataBoundary>
        </ConsoleCard>

        <ConsoleCard title={t.activity.blog}>
          <DataBoundary
            loading={blog.loading}
            error={blog.error}
            isEmpty={blog.data.posts.length === 0}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {blog.data.posts.map((post) => (
                <div key={post.url}>
                  <a className="hd-link" href={post.url} target="_blank" rel="noreferrer">
                    {post.title}
                  </a>
                  <div style={{ fontSize: 12, color: "var(--hd-t3)", marginTop: 2 }}>
                    {formatDate(post.publishedAt)}
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
