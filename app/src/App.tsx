import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import AppLayout from "@cloudscape-design/components/app-layout";
import TopNavigation from "@cloudscape-design/components/top-navigation";

import { applyColorMode, getInitialMode, type ColorMode } from "./lib/theme";
import { useStrings } from "./i18n";
import ConsoleNav, { type ConsoleNavSection } from "./components/ConsoleNav";
import {
  iconOverview,
  iconExperience,
  iconProjects,
  iconCerts,
  iconActivity,
  iconContact,
} from "./components/navIcons";
import Overview from "./views/Overview";
import Experience from "./views/Experience";
import Projects from "./views/Projects";
import Certifications from "./views/Certifications";
import Activity from "./views/Activity";
import Contact from "./views/Contact";

// 라우트 경로 + 네비 아이콘 + 섹션 그룹을 한 곳에서 관리한다.
const NAV_GROUPS = [
  {
    sectionKey: "sectionProfile" as const,
    items: [
      { path: "/overview", key: "overview" as const, icon: iconOverview },
      { path: "/experience", key: "experience" as const, icon: iconExperience },
      { path: "/projects", key: "projects" as const, icon: iconProjects },
      { path: "/certifications", key: "certifications" as const, icon: iconCerts },
    ],
  },
  {
    sectionKey: "sectionMore" as const,
    items: [
      { path: "/activity", key: "activity" as const, icon: iconActivity },
      { path: "/contact", key: "contact" as const, icon: iconContact },
    ],
  },
];

export default function App() {
  const t = useStrings();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<ColorMode>(getInitialMode);

  function toggleMode() {
    const next: ColorMode = mode === "dark" ? "light" : "dark";
    applyColorMode(next);
    setMode(next);
  }

  // NAV_GROUPS → ConsoleNav 섹션 구조로 변환 (i18n 텍스트 주입).
  const navSections: ConsoleNavSection[] = NAV_GROUPS.map((group) => ({
    label: t.nav[group.sectionKey],
    items: group.items.map((item) => ({
      key: item.key,
      text: t.nav[item.key],
      href: item.path,
      icon: item.icon,
    })),
  }));

  return (
    <>
      <div id="top-nav">
        <TopNavigation
          identity={{
            href: "/overview",
            title: t.app.title,
            onFollow: (e) => {
              e.preventDefault();
              navigate("/overview");
            },
          }}
          utilities={[
            {
              type: "button",
              iconName: mode === "dark" ? "star" : "star-filled",
              text: mode === "dark" ? t.app.toggleLight : t.app.toggleDark,
              onClick: toggleMode,
              ariaLabel: mode === "dark" ? t.app.toggleLight : t.app.toggleDark,
            },
          ]}
        />
      </div>
      <AppLayout
        headerSelector="#top-nav"
        toolsHide
        disableContentPaddings
        navigation={
          <ConsoleNav
            sections={navSections}
            activeHref={location.pathname}
            onNavigate={(href) => navigate(href)}
            brand={t.app.title}
          />
        }
        content={
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        }
      />
    </>
  );
}
