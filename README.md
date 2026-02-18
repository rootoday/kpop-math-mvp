# K-POP Math
**K-pop 아티스트로 배우는 대수학 학습 플랫폼**
> 팔로워 71명 Instagram 계정에서 7일간 조회 27,001회, 도달 21,346계정 달성.
> 반응의 99.2%가 비팔로워에서 발생 — 콘텐츠 자체의 시장 반응을 확인했습니다.
🔗 **[Live Demo →](https://kpop-math-mvp.vercel.app)**
---
## 제품 소개
NewJeans, SEVENTEEN 등 K-pop 아티스트를 활용한 5단계 티어 기반 대수학 학습 플랫폼입니다.
- 회원가입 → 레슨 선택 → XP 획득 전체 플로우 작동
- Hook → Concept → Practice → Deep Practice → Wrap-up 5단계 구조
- Playwright E2E 테스트 24/25 PASS
## 트랙션 (2026년 2월 기준)
| 지표 | 수치 |
|------|------|
| Instagram 조회 (7일) | 27,001 |
| 도달 계정 | 21,346 |
| 비팔로워 도달 비율 | 99.2% |
| 공유 | 487 |
| 좋아요 | 1,627 |
## 기술 스택
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Testing**: Playwright E2E
- **Deployment**: Vercel + GitHub Actions CI
## CI/CD
![CI](https://github.com/rootoday/kpop-math-mvp/actions/workflows/ci.yml/badge.svg)
---
## 개발 환경 설정
### Prerequisites
- Node.js 20+ and npm
- Supabase account
- Vercel account (for deployment)
### Local Development
1. Install dependencies:
npm install
2. Set up environment variables:
cp .env.local.example .env.local
3. Run database migrations:
supabase db push
4. Start development server:
npm run dev
