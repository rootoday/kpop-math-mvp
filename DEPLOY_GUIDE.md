# 🚀 K-POP Math MVP - 상세 배포 가이드 (Vercel)

이 가이드는 프로젝트를 GitHub에 올린 후, Vercel을 통해 실제 웹사이트로 배포하는 과정을 초보자도 따라 할 수 있게 상세히 설명합니다.

---

## 1단계: Supabase에서 환경 변수 찾기

Vercel 배포 시 가장 중요한 것은 **사용자의 Supabase 프로젝트와 Vercel을 연결**하는 것입니다.

1.  [Supabase Dashboard](https://supabase.com/dashboard)에 로그인합니다.
2.  해당 프로젝트를 선택합니다.
3.  왼쪽 사이드바 하단의 **Project Settings (톱니바퀴 아이콘)**를 클릭합니다.
4.  **API** 탭을 클릭합니다.
5.  여기서 아래 두 가지 값을 복사해 두세요:
    *   **Project URL**: `https://xxxx.supabase.co` 형식
    *   **API Key (anon public)**: 아주 긴 문자열

---

## 2단계: Vercel 프로젝트 생성

1.  [Vercel Dashboard](https://vercel.com/dashboard)에 접속하여 **Add New -> Project** 버튼을 누릅니다.
2.  **Import Git Repository** 목록에서 본인의 `kpop-math-mvp` 저장소를 찾아 **Import** 버튼을 클릭합니다.
    *   *목록에 없다면 GitHub 권한 설정을 통해 저장소를 추가해야 할 수 있습니다.*

---

## 3단계: 환경 변수(Environment Variables) 설정 (중요!)

**Configure Project** 화면의 중간에 있는 **Environment Variables** 메뉴를 펼칩니다. 아까 복사한 값을 하나씩 입력합니다.

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase의 **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase의 **API Key (anon public)** |

*   **입력 방법**: `Key` 칸에 이름을 넣고, `Value` 칸에 값을 붙여넣은 뒤 **Add** 버튼을 누르세요. 두 개 모두 등록되어야 합니다.

---

## 4단계: 배포 (Deploy)

1.  모든 설정이 끝났다면 하단의 **Deploy** 버튼을 클릭합니다.
2.  약 1~2분 정도 빌드 과정(Building)이 진행됩니다.
    *   *우리가 설정한 GitHub Action과 유사한 과정이 Vercel 서버에서 진행됩니다.*
3.  **Congratulations!** 화면과 함께 종이 꽃가루가 날리면 성공입니다!
4.  화면에 표시된 주소(예: `kpop-math-mvp.vercel.app`)를 클릭하여 접속해 보세요.

---

## 💡 자주 묻는 질문 (FAQ)

**Q: 나중에 코드를 수정하면 다시 배포해야 하나요?**
> 아니요! GitHub에 `git push`를 하기만 하면, Vercel이 자동으로 감지하여 **실시간으로 다시 배포**해 줍니다. 매우 편리하죠!

**Q: 만약 배포 중에 오류(Error)가 나면 어떻게 하나요?**
> Vercel 화면의 **Deployment Status** 탭이나 **Logs**를 확인해 보세요. 어떤 파일에서 문제가 생겼는지 상세히 알려줍니다. 오류가 해결되지 않으면 저에게 로그 내용을 복사해서 보여주세요!

**Q: 사이트에 들어갔는데 데이터가 안 나와요.**
> Supabase SQL Editor에서 제가 드린 마이그레이션(001~006번)을 모두 실행했는지 다시 한번 확인해 주세요!
