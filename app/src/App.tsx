import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import AppLayout from "@cloudscape-design/components/app-layout";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import TopNavigation from "@cloudscape-design/components/top-navigation";

import { applyColorMode, getInitialMode, type ColorMode } from "./lib/theme";
import { useStrings } from "./i18n";
import Overview from "./views/Overview";
import Experience from "./views/Experience";
import Projects from "./views/Projects";
import Certifications from "./views/Certifications";
import Activity from "./views/Activity";
import Contact from "./views/Contact";

// 라우트 경로와 네비게이션 항목을 한 곳에서 관리한다.
const ROUTES = [
  { path: "/overview", key: "overview" as const },
  { path: "/experience", key: "experience" as const },
  { path: "/projects", key: "projects" as const },
  { path: "/certifications", key: "certifications" as const },
  { path: "/activity", key: "activity" as const },
  { path: "/contact", key: "contact" as const },
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

  const navItems = ROUTES.map((route) => ({
    type: "link" as const,
    text: t.nav[route.key],
    href: route.path,
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
        navigation={
          <SideNavigation
            header={{ href: "/overview", text: t.app.subtitle }}
            activeHref={location.pathname}
            items={[
              {
                type: "section-group",
                title: t.nav.sectionMain,
                items: navItems,
              },
            ]}
            onFollow={(e) => {
              if (!e.detail.external) {
                e.preventDefault();
                navigate(e.detail.href);
              }
            }}
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
