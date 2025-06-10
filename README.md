# 한국경제 뉴스 모아보기 📰

주요 경제 뉴스를 자동으로 수집하여 제공하는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **자동 업데이트**: 매일 오후 4시(KST)에 뉴스 자동 업데이트
- **카테고리 필터**: 주식시장, 산업동향, 정책/제도, 국제경제별 분류
- **실시간 검색**: 뉴스 제목, 내용, 출처 기반 검색
- **반응형 디자인**: 모바일과 데스크톱에 최적화된 UI
- **한국 시간대 지원**: KST 기준 시간 표시 및 스케줄링

## 📋 설정 방법

### 1. 저장소 설정

```bash
git clone https://github.com/your-username/korean-economy-news.git
cd korean-economy-news
```

### 2. GitHub Pages 활성화

1. GitHub 저장소 → Settings → Pages
2. Source: "Deploy from a branch" 선택
3. Branch: `gh-pages` 선택
4. 저장

### 3. GitHub Actions 설정

GitHub Actions는 다음과 같이 자동 실행됩니다:

- **매일 오후 4시 (KST)**: 자동 뉴스 업데이트
- **수동 실행**: Actions 탭에서 "Update Korean Economy News" 워크플로우 실행

### 4. 권한 설정

저장소 Settings → Actions → General → Workflow permissions에서:
- "Read and write permissions" 선택
- "Allow GitHub Actions to create and approve pull requests" 체크

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js (뉴스 수집)
- **배포**: GitHub Pages
- **자동화**: GitHub Actions
- **데이터**: RSS 피드 파싱

## 📊 뉴스 소스

현재 다음 언론사의 RSS 피드를 수집합니다:

- 연합뉴스
- 매일경제
- 한국경제
- 이데일리
- KBS
- SBS
- 서울경제
- 머니투데이

## 🔧 커스터마이징

### 뉴스 소스 추가

`fetch-news.js` 파일의 `RSS_FEEDS` 객체에 새로운 RSS 피드를 추가:

```javascript
const RSS_FEEDS = {
    '새언론사': {
        url: 'https://example.com/rss/economy.xml',
        category: 'industry'
    }
};
```

### 업데이트 시간 변경

`.github/workflows/update-news.yml` 파일의 cron 스케줄 수정:

```yaml
schedule:
  - cron: '0 8 * * *'  # 매일 오후 5시 (KST)로 변경
```

### 스타일 수정

`styles.css` 파일을 편집하여 디자인 커스터마이징

## 📱 로컬 개발

```bash
# 간단한 HTTP 서버 실행
python -m http.server 8000
# 또는
npx serve .

# 브라우저에서 http://localhost:8000 접속
```

## 🔄 업데이트 프로세스

1. **뉴스 수집**: RSS 피드에서 최신 뉴스 파싱
2. **데이터 가공**: 카테고리 분류 및 시간 정렬
3. **파일 저장**: `news-data.json`으로 저장
4. **자동 배포**: GitHub Pages에 업데이트된 내용 배포

## 📈 성능 최적화

- **캐싱**: localStorage를 활용한 클라이언트 캐싱
- **지연 로딩**: 필요한 시점에 뉴스 데이터 로드
- **압축**: 이미지 및 CSS 최적화

## 🔒 보안 고려사항

- **CORS**: 외부 API 호출 시 CORS 정책 준수
- **XSS 방지**: 사용자 입력 데이터 sanitization
- **API 키**: 환경변수를 통한 민감 정보 관리

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🐛 버그 리포트

버그를 발견하시면 [Issues](https://github.com/your-username/korean-economy-news/issues)에 등록해주세요.

## 📞 연락처

- 이메일: your-email@example.com
- GitHub: [@your-username](https://github.com/your-username)

---

⭐ 이 프로젝트가 유용하다면 별점을 눌러주세요! 