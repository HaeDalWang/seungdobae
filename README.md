# seungdobae

AWS 콘솔 스타일의 살아있는 자기표현 사이트. 성장하면 데이터가 자동으로 갱신된다.

**컨셉:** "내 포트폴리오 자체가 AWS 콘솔이다" — Cloudscape Design System으로 좌측 서비스 네비, 대시보드 위젯, 자격증 리소스 카드를 구성해 매체 그 자체로 AWS 전문성을 보여준다.

**핵심 동작:** 사람은 사실(bullet)만 채우고, 프레젠테이션은 사이트가 담당. GitHub Actions가 빌드 시점에 외부 데이터를 수집해 `app/public/data/*.json`으로 떨구고, 앱은 런타임에 fetch한다. → 코드와 데이터 완전 분리.

## 구조

```
seungdobae/
├── app/                  # 프론트엔드 (Vite + React + TS + Cloudscape)
│   ├── src/
│   │   ├── views/        # 6개 뷰 (Overview/Experience/Projects/Certifications/Activity/Contact)
│   │   ├── components/   # 위젯 (KpiWidget, DataBoundary)
│   │   ├── data/         # 타입 · 검증 · 로더 훅
│   │   ├── lib/          # theme · career · format
│   │   └── i18n/         # 한국어 문자열 (확장 가능 구조)
│   ├── public/data/      # 데이터 JSON (런타임 fetch 대상)
│   ├── scripts/          # 빌드타임 수집 (fetch-github, fetch-credly)
│   └── tests/            # vitest(unit) + playwright(e2e)
├── infra/                # Terraform (S3/CloudFront/ACM/Route53/OIDC)
└── .github/workflows/    # deploy.yml (push + 주1회 cron + dispatch)
```

## 로컬 개발

```bash
cd app
npm install
npm run dev          # 개발 서버
npm run build        # 타입체크 + 프로덕션 빌드
npm run test         # 단위 테스트 (vitest)
npm run test:e2e     # e2e 테스트 (playwright)
```

## 데이터 채우기

**수동** (`app/public/data/` — 사실만 입력):
- `profile.json` — 이름, 직함, 소개, `careerStartDate`(경력연차 자동계산 기준), 연락처
- `experience.json` — 경력 항목 배열
- `projects.json` — 프로젝트 카드

**자동** (CI가 덮어씀, 로컬 테스트 시 수동 실행 가능):
```bash
npm run fetch:github -- <github-username>
npm run fetch:credly -- <credly-username>
```

## 배포 (Terraform)

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # 도메인·레포 등 채우기
terraform init
terraform plan
terraform apply
```

apply 후 출력값을 GitHub 저장소에 설정:

| 종류 | 키 | 값 |
|------|-----|-----|
| Secret | `AWS_DEPLOY_ROLE_ARN` | `deploy_role_arn` 출력 |
| Variable | `SITE_BUCKET` | `bucket_name` 출력 |
| Variable | `CLOUDFRONT_DISTRIBUTION_ID` | `cloudfront_distribution_id` 출력 |
| Variable | `GH_USERNAME` | 본인 GitHub 사용자명 |
| Variable | `CREDLY_USERNAME` | 본인 Credly 사용자명 |

**외부 등록 도메인:** Route53 존을 새로 생성한 경우(`create_route53_zone = true`), `name_servers` 출력값을 도메인 등록기관의 네임서버로 위임해야 ACM DNS 검증과 사이트 접속이 완료된다.

## 보안

- S3는 비공개 + OAC. 퍼블릭 액세스 전면 차단, CloudFront만 접근.
- 배포는 GitHub OIDC 단기 자격증명 (액세스 키 미사용). trust policy로 지정 저장소만 허용.
- CloudFront 응답 헤더: HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
