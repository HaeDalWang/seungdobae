/**
 * 한국어 문자열. 확장 시 같은 키 구조로 en.ts를 추가하면 된다.
 * 네비게이션, 뷰 제목, 위젯 라벨 등 UI 텍스트를 한 곳에서 관리한다.
 */
export const ko = {
  nav: {
    overview: "개요",
    experience: "경력",
    projects: "프로젝트",
    certifications: "자격증",
    activity: "활동",
    contact: "연락처",
    sectionMain: "둘러보기",
  },
  app: {
    title: "배승도",
    subtitle: "AWS MSP Engineer",
    toggleDark: "다크 모드",
    toggleLight: "라이트 모드",
  },
  overview: {
    title: "개요",
    careerYears: "경력",
    careerUnit: "년차",
    certCount: "보유 자격증",
    certUnit: "개",
    repoCount: "공개 저장소",
    repoUnit: "개",
    starCount: "받은 Star",
    starUnit: "개",
    about: "소개",
    recentActivity: "최근 활동",
  },
  experience: {
    title: "경력",
    present: "현재",
  },
  projects: {
    title: "프로젝트",
    stack: "기술 스택",
    viewArticle: "관련 기사 보기",
  },
  certifications: {
    title: "자격증",
    issuedBy: "발급",
    issuedAt: "취득일",
    viewBadge: "배지 보기",
    skills: "관련 스킬",
  },
  activity: {
    title: "활동",
    recentRepos: "최근 저장소",
    languages: "언어 분포",
    blog: "블로그 글",
    repoName: "저장소",
    repoStars: "Star",
    repoLang: "주 언어",
    repoUpdated: "업데이트",
  },
  contact: {
    title: "연락처",
    email: "이메일",
    github: "GitHub",
    linkedin: "LinkedIn",
    location: "지역",
  },
  common: {
    loading: "불러오는 중…",
    empty: "표시할 데이터가 없습니다.",
    error: "데이터를 불러오지 못했습니다.",
    externalLink: "새 탭에서 열기",
  },
} as const;

export type Strings = typeof ko;
