# 📈 한국경제 뉴스 모아보기

한국의 주요 경제 뉴스를 자동으로 수집하고 인기도순으로 정렬하여 제공하는 웹사이트입니다.

🌐 **사이트 주소**: [https://sangkwon9.github.io/korean-economy-news/](https://sangkwon9.github.io/korean-economy-news/)

## ✨ 주요 기능

### 🔄 자동 뉴스 업데이트
- **매일 자정 (한국시간) 자동 업데이트**: GitHub Actions를 통해 스케줄링
- **실시간 인기도 분석**: 키워드 기반 인기도 점수 계산
- **중복 제거**: 동일한 제목의 기사 자동 필터링
- **상위 20개 선별**: 인기도 높은 뉴스만 엄선하여 표시

### 📰 뉴스 소스
다음 주요 언론사의 RSS 피드에서 뉴스를 수집합니다:
- 📊 **한국경제** - https://rss.hankyung.com/economy.xml
- 💼 **매일경제** - https://www.mk.co.kr/rss/30000001/
- 📺 **연합뉴스** - https://www.yonhapnews.co.kr/rss/economy.xml
- 💰 **서울경제** - https://www.sedaily.com/NewsList/02/RSSNewsList_02.xml
- 🏢 **이데일리** - https://rss.edaily.co.kr/economy.xml

### 🎯 스마트 카테고리 분류
- **주식시장**: 코스피, 코스닥, 증시 관련 뉴스
- **산업동향**: 반도체, 자동차, 조선, 철강 등 주요 산업
- **정책/제도**: 정부 정책, 한국은행 기준금리 관련
- **국제경제**: 환율, 무역, 수출입 관련
- **취업/고용**: 일자리, 실업률, 채용 정보
- **금융**: 은행, 증권, 투자 관련
- **부동산**: 아파트, 집값, 전세 관련
- **스타트업**: 벤처, 창업 관련

### 🔥 인기도 시스템
뉴스의 인기도는 다음 요소들로 계산됩니다:
- **경제 키워드 매칭**: 40개 핵심 경제 용어 분석
- **긴급성 키워드**: "속보", "긴급" 등 +20점
- **관심도 키워드**: "폭등", "폭락", "사상최고" 등 +15점
- **최대 100점 스케일**로 정규화

### 🎨 사용자 인터페이스
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- **실시간 검색**: 제목, 내용, 언론사 검색 가능
- **카테고리 필터**: 관심 분야별 뉴스 분류
- **인기 뉴스 하이라이트**: 상위 3개 뉴스 특별 표시
- **자동 새로고침**: 5분마다 최신 데이터 확인

## 🛠️ 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 그라디언트, 애니메이션, 반응형 레이아웃
- **Vanilla JavaScript**: 비동기 데이터 로딩, DOM 조작

### Backend & 자동화
- **Node.js**: 뉴스 수집 스크립트
- **GitHub Actions**: 스케줄링 및 자동 배포
- **RSS 파싱**: xml2js 라이브러리 활용
- **한국시간 처리**: moment-timezone

### 주요 라이브러리
```json
{
  "axios": "^1.6.2",      // HTTP 요청
  "cheerio": "^1.0.0",    // HTML 파싱
  "xml2js": "^0.6.2",     // RSS XML 파싱
  "moment-timezone": "^0.5.44"  // 한국시간 처리
}
```

## 📅 자동화 스케줄

### 뉴스 업데이트 주기
- **매일 00:00 (한국시간)**: 전체 뉴스 데이터 업데이트
- **5분마다**: 웹사이트에서 자동 새로고침 체크
- **수동 업데이트**: GitHub Actions 수동 실행 가능

### 업데이트 프로세스
1. **RSS 피드 수집**: 5개 언론사에서 최신 뉴스 가져오기
2. **데이터 정규화**: HTML 태그 제거, 날짜 포맷 통일
3. **중복 제거**: 제목 기준 중복 기사 필터링
4. **인기도 분석**: 키워드 기반 점수 계산
5. **상위 선별**: 인기도 높은 20개 뉴스 선정
6. **JSON 업데이트**: news-data.json 파일 갱신
7. **자동 배포**: GitHub Pages 업데이트

## 🚀 개발 및 배포

### 로컬 개발
```bash
# 저장소 클론
git clone https://github.com/sangkwon9/korean-economy-news.git
cd korean-economy-news

# 의존성 설치
npm install

# 뉴스 데이터 업데이트 (테스트)
npm run update-news

# 로컬 서버 실행 (Python 사용 예시)
python -m http.server 8000
```

### 수동 뉴스 업데이트
```bash
node update-news.js
```

### GitHub Actions 수동 실행
1. GitHub 저장소의 Actions 탭 방문
2. "Deploy Korean Economy News to GitHub Pages" 워크플로우 선택
3. "Run workflow" 버튼 클릭

## 📊 데이터 구조

### news-data.json 형식
```json
{
  "lastUpdated": "2025-01-27T15:00:00+09:00",
  "updateTime": "2025년 01월 27일 15:00",
  "totalCollected": 87,
  "uniqueNews": 65,
  "topNewsCount": 20,
  "news": [
    {
      "id": 1737975600123,
      "title": "코스피 3000선 돌파, 외국인 매수세 지속",
      "summary": "코스피가 3000선을 돌파하며...",
      "url": "https://example.com/news1",
      "source": "한국경제",
      "category": "stock",
      "date": "2025.01.27",
      "popularity": 95,
      "fetchTime": "2025-01-27T06:00:00.000Z"
    }
  ]
}
```

## 🔧 주요 설정

### GitHub Actions 스케줄
```yaml
schedule:
  # 매일 한국시간 자정 (UTC 15:00)
  - cron: '0 15 * * *'
```

### RSS 피드 타임아웃
- **연결 타임아웃**: 10초
- **피드별 딜레이**: 1초 (API 제한 방지)

### 인기도 계산 가중치
- **기본 점수**: 50점
- **경제 키워드**: +10점 (키워드당)
- **긴급 키워드**: +20점
- **관심 키워드**: +15점

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새 기능 브랜치를 만듭니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 작성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

- **개발자**: sangkwon9
- **GitHub**: [@sangkwon9](https://github.com/sangkwon9)
- **프로젝트 링크**: [https://github.com/sangkwon9/korean-economy-news](https://github.com/sangkwon9/korean-economy-news)

---

⭐ **이 프로젝트가 유용하다면 별점을 눌러주세요!** 