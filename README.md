# 🏢 고객 관리 시스템 - 백엔드 API

> **이 프로젝트는 프론트엔드와 백엔드로 구성된 완전한 고객 관리 시스템의 백엔드 부분입니다.**

## 📋 프로젝트 개요

**고객 관리 시스템**은 중소기업이나 개인사업자가 고객 정보를 체계적으로 관리할 수 있도록 도와주는 웹 애플리케이션입니다.

### 🔗 연관 저장소
- **🎨 프론트엔드**: [customer-frontend](https://github.com/your-username/customer-frontend) - 사용자가 실제로 보고 사용하는 웹 인터페이스
- **⚡ 백엔드**: [customer-backend](https://github.com/your-username/customer-backend) - 현재 저장소 (데이터 처리 및 API 제공)

### 🎯 백엔드의 역할
이 백엔드 API는 다음과 같은 역할을 담당합니다:
- 📊 **데이터 관리**: 고객 정보를 안전하게 저장하고 관리
- 🔒 **보안**: 데이터 검증 및 접근 권한 제어
- 🌐 **API 제공**: 프론트엔드가 사용할 REST API 엔드포인트 제공
- 📈 **시스템 상태**: 서버 및 데이터베이스 상태 모니터링

## 🛠️ 기술 스택

### **메인 프레임워크**
- **NestJS** - Node.js 기반의 확장 가능한 서버 프레임워크
- **TypeScript** - 타입 안전성을 보장하는 JavaScript

### **데이터베이스**
- **Supabase** - PostgreSQL 기반의 오픈소스 Firebase 대안
- **PostgreSQL** - 관계형 데이터베이스 (Supabase 내장)

### **개발 도구**
- **Swagger** - API 문서 자동 생성 및 테스트
- **Class Validator** - 입력 데이터 검증
- **ESLint & Prettier** - 코드 품질 관리

### **배포**
- **Koyeb** - 무료 클라우드 플랫폼 (슬립 모드 없음)

## 🚀 시작하기

### 1️⃣ 환경 설정

```bash
# 1. 저장소 복제
git clone https://github.com/your-username/customer-backend.git
cd customer-backend

# 2. 의존성 설치
npm install

# 3. 환경변수 파일 생성
# .env 파일을 생성하고 아래 내용을 입력하세요
```

### 2️⃣ 환경변수 설정

`.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 입력하세요:

```bash
# Supabase 설정 (필수)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 서버 포트 (선택사항, 기본값: 3001)
PORT=3001
```

**🔑 Supabase 키 확인 방법:**
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → Settings → API
3. `Project URL`과 `service_role secret` 복사

### 3️⃣ 데이터베이스 설정

Supabase에서 다음 테이블을 생성하세요:

```sql
-- customers 테이블 생성
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 설정
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 모든 작업 허용 정책 (개발용)
CREATE POLICY "Enable all operations for service role" ON customers
FOR ALL USING (true);
```

### 4️⃣ 서버 실행

```bash
# 개발 모드 (파일 변경 시 자동 재시작)
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

**✅ 서버가 성공적으로 시작되면:**
- 🌐 API 서버: http://localhost:3001
- 📖 Swagger 문서: http://localhost:3001/api

## 📡 API 엔드포인트

### **고객 관리**
```
GET    /customers       # 모든 고객 조회
POST   /customers       # 새 고객 등록
GET    /customers/:id   # 특정 고객 조회
PATCH  /customers/:id   # 고객 정보 수정
DELETE /customers/:id   # 고객 삭제
```

### **시스템 상태**
```
GET    /health          # 시스템 상태 확인
GET    /                # 서버 동작 확인
```

### **📖 API 문서**
서버 실행 후 http://localhost:3001/api 에서 상세한 API 문서를 확인할 수 있습니다.

## 📁 프로젝트 구조

```
src/
├── common/
│   └── supabase.service.ts    # Supabase 연결 서비스
├── customers/
│   ├── dto/                   # 데이터 전송 객체
│   │   ├── create-customer.dto.ts
│   │   └── update-customer.dto.ts
│   ├── entities/
│   │   └── customer.entity.ts # 고객 엔티티
│   ├── customers.controller.ts # API 컨트롤러
│   ├── customers.service.ts   # 비즈니스 로직
│   └── customers.module.ts    # 모듈 설정
├── app.controller.ts          # 메인 컨트롤러
├── app.module.ts              # 앱 모듈
├── app.service.ts             # 앱 서비스
└── main.ts                    # 앱 진입점
```

## 🌐 프론트엔드와의 연동

이 백엔드는 **React/Next.js 프론트엔드**와 함께 동작합니다:

1. **프론트엔드에서 API 호출** → 이 백엔드가 응답
2. **사용자가 고객 등록** → 백엔드가 Supabase에 저장
3. **고객 목록 조회** → 백엔드가 데이터베이스에서 조회 후 반환

**🔗 프론트엔드 저장소**: [customer-frontend](https://github.com/your-username/customer-frontend)

## 🚢 배포 (Koyeb)

### 배포 URL
- **API 서버**: https://your-app-name.koyeb.app
- **Swagger 문서**: https://your-app-name.koyeb.app/api

### 배포 방법
1. [Koyeb Dashboard](https://app.koyeb.com/) 접속
2. "Create App" 클릭
3. GitHub 저장소 연결
4. 환경변수 설정 (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
5. 배포 완료!

## 🔧 개발 도구

### 코드 품질
```bash
npm run lint        # ESLint 검사
npm run format      # Prettier 포맷팅
```

### 테스트
```bash
npm run test        # 단위 테스트
npm run test:e2e    # E2E 테스트
```

## 🤝 기여하기

1. 이 저장소를 Fork 하세요
2. 새로운 기능 브랜치를 만드세요 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋하세요 (`git commit -am '새 기능 추가'`)
4. 브랜치에 Push 하세요 (`git push origin feature/새기능`)
5. Pull Request를 생성하세요

## 📞 문의사항

- **이슈 리포트**: GitHub Issues 탭 활용
- **프론트엔드 관련**: [customer-frontend](https://github.com/your-username/customer-frontend) 저장소

## 📄 라이센스

MIT License - 자유롭게 사용하세요!

---

## 🎯 전체 시스템 아키텍처

```
[사용자] → [Next.js 프론트엔드] → [NestJS 백엔드] → [Supabase DB]
          (Vercel 배포)         (Koyeb 배포)      (클라우드)
```

**이 저장소는 위 아키텍처에서 "NestJS 백엔드" 부분을 담당합니다.**

## 🚀 Koyeb 배포 가이드

### 1. 환경변수 설정
Koyeb 대시보드에서 다음 환경변수를 설정해주세요:

```bash
# 필수 환경변수
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 선택 환경변수
FRONTEND_URL=https://your-nextjs-app.vercel.app
```

### 2. Koyeb 빌드 설정

**빌드 명령어:**
```bash
npm install && npm run build
```

**시작 명령어:**
```bash
npm start
```

**포트:** Koyeb이 자동으로 PORT 환경변수를 설정합니다.

### 3. Git 저장소 연결
1. Koyeb 대시보드에서 "Create App" 클릭
2. GitHub/GitLab 저장소 연결
3. 빌드 설정에서 위의 명령어 입력
4. 환경변수 추가
5. 배포 시작

## 🔧 로컬 개발

### 설치
```bash
npm install
```

### 환경변수 설정
`.env` 파일을 루트에 생성:
```bash
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:3000
```

### 실행
```bash
# 개발 모드
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

## 📚 API 문서

서버 실행 후 Swagger 문서를 확인할 수 있습니다:
- 로컬: http://localhost:3001/api
- 배포: https://your-app.koyeb.app/api

## 🛠 주요 기능

- **고객 관리**: CRUD 작업
- **Swagger 문서**: 자동 API 문서화
- **유효성 검사**: class-validator 사용
- **CORS 설정**: 프론트엔드와 안전한 통신

## 🔍 문제 해결

### 배포 오류
1. 환경변수가 모두 설정되었는지 확인
2. Supabase 키가 올바른지 확인
3. 빌드 명령어가 정확한지 확인

### CORS 오류
프론트엔드 URL을 `FRONTEND_URL` 환경변수에 정확히 설정해주세요.
