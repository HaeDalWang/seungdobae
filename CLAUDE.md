# seungdobae — 살아있는 이력서

이 사이트는 **배승도의 이력서**다. 코드 품질보다 먼저 묻는다:
"이 변경이 면접관에게 나를 더 정확하고, 더 믿을 만하게 보여주는가?"

## 독자와 성공 기준

- **독자:** 채용 면접관·기술 리더·고객사 담당자. 바쁘고, 의심이 많고, 숫자를 검증하려 든다.
- **30초 테스트:** 첫 화면(개요)만 보고 ① 무슨 일을 하는 사람인지(AWS MSP · EKS 운영 · IaC),
  ② 어느 정도 규모인지(숫자), ③ 그 숫자를 왜 믿어도 되는지(증거)가 읽혀야 한다.
- **포지셔닝:** "AWS·EKS 운영 현장의 반복 업무를 **AI 에이전트 툴링**으로 시스템화하는 MSP 엔지니어".
  - 앞으로의 축: 에이전트 툴링 개발, 특히 **티켓 대응** 자동화. 대표 작업(`featured`)은 이 축에서 고른다
    (현재 대표 `k8s-upgrade-skills`가 바로 그 사례 — 운영 노하우를 phase-gated Skill로 만든 AI 툴링).
  - 기반 축: EKS 운영·무중단 업그레이드·Terraform IaC. 에이전트 툴링이 "현장에서 나왔다"는 근거로 쓴다.
  - 새 콘텐츠는 이 흐름(운영 현장 → 툴링으로 시스템화)을 강화하거나, 적어도 흐리지 않아야 한다.

## 콘텐츠 원칙 (가장 중요)

1. **사실만, 본인 기준.** 성과·숫자·경력을 지어내거나 부풀리지 않는다. 근거가 없으면 Claude가
   채우지 말고 나에게 묻는다. 그럴듯한 placeholder도 금지 — 빈 값은 빈 값으로 둔다.
2. **관여 범위를 정확한 동사로 쓴다.** "운영"·"대리 운영"은 직접 책임지는 범위에만 쓴다
   (현재: 1개 고객사 · EKS 4개 클러스터). 그 외는 "지원"이다(KPI도 "지원 EKS 클러스터 15" — 15개 전부
   알람 기반 24/7 On-Call). 업그레이드처럼 현장에서 직접 수행한 큰 작업은 "현장 작업 수행"으로 따로 적는다.
   "여러 고객사를 운영" 같은 뭉뚱그린 표현은 과장이다.
3. **숫자에는 집계 기준을 붙인다.** "782건"이 아니라 "누적 782건(Zendesk 기준)". 기준을 쓸 수 없는
   숫자는 싣지 않는다.
4. **신뢰 사다리: 숫자 → 증거.** 본인 집계 숫자 다음에는 제3자가 검증할 수 있는 증거를 둔다.
   우선순위: 제3자 인증(Credly·자격증 이름) > 공개 코드(GitHub, `local-metrics.mjs`) > 언론 기사 > 자기 서술.
5. **고객 정보는 절대 노출하지 않는다.** 고객사명, kube context 이름, 계정 ID, 티켓 내용 모두 금지.
   필요하면 업종 수준으로만 표현한다(예: "대형 미디어·콘텐츠 기업"). 이미 공개된 기사에 나온 내용은 예외.
   비노출 자체를 "고객정보 전면 제외·로직 공개"라는 신뢰의 근거로 쓴다.
6. **한 숫자는 한 곳에서.** 같은 지표가 경력 bullet과 KPI 위젯에 따로 적혀 어긋나면 신뢰가 무너진다.
   원본은 `profile.json`의 `metrics`. bullet에서는 그 값과 일치시키거나 "개요의 ○○ 지표"로 참조한다.
7. **빈 것은 숨긴다.** 0건짜리 섹션, 빈 위젯, "준비 중"은 렌더링하지 않는다. 없는 것은 약점이 아니지만,
   비어 있는 칸은 약점이다.
8. **bullet 형식:** `무엇을 — 어떻게(기술·방법) — 결과(숫자/검증)`. 형용사("뛰어난", "다양한") 대신 동사와 숫자.
9. **비공개 작업**은 제목에 "(비공개)"를 붙이고 `url`을 넣지 않는다. 설명은 구조·역할 중심으로.
10. **링크 라벨은 정확하게.** GitHub는 "GitHub에서 보기", 기사는 "관련 기사 보기" (`lib/link.ts`).
   라벨과 목적지가 다르면 사소해 보여도 신뢰를 깎는다.

콘텐츠를 바꾸기 전에 면접관 입장에서 한 번 더 읽는다: "이걸 어떻게 믿지?"라는 질문이 남으면 아직 덜 된 것이다.

## 컨셉 (고정)

"포트폴리오 자체가 AWS 콘솔" — **Cloudscape Design System** 그대로. 좌측 서비스 네비, 대시보드 위젯,
리소스 카드. 다른 디자인(핸드오프 "Warm Academic Humanism")을 적용했다가 되돌린 이력이 있다
(`design_handoff_aws_console/`는 참고용, 미추적). 컨셉·디자인 시스템 변경은 먼저 나에게 묻는다.

## 데이터 — 누가 무엇을 쓰는가

코드와 데이터는 완전히 분리되어 있다. 앱은 `app/public/data/*.json`을 런타임에 fetch한다.

| 파일 | 작성 주체 | 규칙 |
|------|-----------|------|
| `profile.json` (metrics 외) · `experience.json` · `projects.json` · `certifications.json` | 사람(나) | 사실만. Claude는 내가 준 사실을 다듬기만 한다 |
| `profile.json`의 `metrics` | `npm run metrics:local -- --write` (로컬 전용) | 손으로 고치지 않는다. kubeconfig·Zendesk·`~/salt` IaC를 읽어 숫자만 남긴다. CI에서 돌리지 않는다 |
| `github.json` · `credly.json` | CI(`fetch:*`)가 매 배포마다 덮어씀 | 손으로 고치지 않는다 |
| `blog.json` | 사람 | 비어 있으면 Activity에서 블로그 섹션이 숨겨진다 |

- JSON은 신뢰하지 않는 입력이다. 모든 파싱은 `src/data/validate.ts`를 거친다.
- 필드를 추가하면 `src/data/types.ts` + `validate.ts` + `tests/validate.test.ts`를 함께 고친다.
- `local-metrics.mjs`를 수정할 때도 출력에 숫자 외의 식별자가 새지 않는지 확인한다(이 스크립트는 공개되어 신뢰 증거로 링크된다).

## 코드 구조

```
app/src/views/       6개 뷰 (Overview / Experience / Projects / Certifications / Activity / Contact)
app/src/components/  위젯 (KpiWidget, ShareBarChart, DetailToggle, DataBoundary)
app/src/data/        타입 · 검증 · 로더 훅
app/src/lib/         순수 로직 (career, format, lectures, link, theme) — 테스트 대상
app/src/i18n/ko.ts   UI 문자열은 전부 여기. 뷰에 한국어 리터럴을 직접 쓰지 않는다
app/scripts/         빌드타임 수집(fetch-github, fetch-credly), 로컬 지표(local-metrics, tech-map)
infra/               Terraform (S3 · CloudFront · ACM · Route53 · GitHub OIDC)
```

## 명령어 (`app/`에서)

```bash
npm run dev           # 개발 서버
npm run test          # vitest 단위 테스트
npm run build         # tsc --noEmit + vite build
npm run test:e2e      # playwright (UI 변경 시)
npm run metrics:local # 지표 드라이런(diff만). 반영은 -- --write
```

완료 전 최소 `npm run test && npm run build`. 화면이 바뀌면 `npm run dev`로 직접 보고, 가능하면 e2e도.

## 배포 — main이 곧 프로덕션

- `main`에 push하면 GitHub Actions(`deploy.yml`)가 테스트 → 수집 → 빌드 → S3 sync → CloudFront 무효화까지
  **즉시 공개**한다. 주 1회(월 03:17 UTC) cron으로도 재배포된다.
- 그래서 push 전에 확인: 테스트·빌드 통과, 고객 정보 미포함, 숫자와 집계 기준 일치.
- `infra/`의 `terraform apply`는 실 리소스를 바꾼다. 반드시 plan을 보여주고 승인받는다.
  `*.tfstate`·`*.tfvars`는 커밋하지 않는다.

## 커밋

전역 규칙의 type에 더해 **`data:`**를 쓴다 — 코드 변경 없이 이력서 내용(JSON)만 바꿀 때.
메시지 본문에는 "왜 이 변경이 이력서를 더 낫게 만드는지"를 적는다(예: "면접관의 '이 숫자를 어떻게 믿나'에 선제 응답").
