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
import { useProfile } from "./data/hooks";
import { contactLinks } from "./lib/contact";

// 라우트 경로와 네비게이션 항목을 한 곳에서 관리한다.
const ROUTES = [
  { path: "/overview", key: "overview" as const },
  { path: "/experience", key: "experience" as const },
  { path: "/projects", key: "projects" as const },
  { path: "/certifications", key: "certifications" as const },
];

export default function App() {
  const t = useStrings();
  const navigate = useNavigate();
  const location = useLocation();
  const isOverview = location.pathname === "/overview";
  const [mode, setMode] = useState<ColorMode>(getInitialMode);
  const profile = useProfile();

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
          // 좁은 화면에서 utilities가 접히는 "더보기" 메뉴의 버튼 문구. 없으면 트리거가 빈 버튼으로 그려진다.
          i18nStrings={{
            overflowMenuTriggerText: t.app.menuMore,
            overflowMenuTitleText: t.app.menuTitle,
            overflowMenuBackIconAriaLabel: t.app.menuBack,
            overflowMenuDismissIconAriaLabel: t.app.menuClose,
          }}
          utilities={[
            ...contactLinks(profile.data.contact).map((link) => ({
              type: "button" as const,
              text: t.contact[link.key],
              href: link.href,
              external: link.external,
              externalIconAriaLabel: link.external ? t.common.externalLink : undefined,
            })),
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
        // 개요는 히어로 배너가 콘텐츠 폭 전체를 덮도록 패딩을 ContentLayout(defaultPadding)에 맡긴다.
        disableContentPaddings={isOverview}
        headerVariant={isOverview ? "high-contrast" : "default"}
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
            {/* 탭을 합친 뒤에도 외부에 공유된 옛 링크가 살아 있도록 리다이렉트한다. */}
            <Route path="/activity" element={<Navigate to="/projects" replace />} />
            <Route path="/contact" element={<Navigate to="/overview" replace />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        }
      />
    </>
  );
}
