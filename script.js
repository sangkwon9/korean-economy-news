// 현재 날짜 설정 (항상 현재 시점 기준)
console.log('스크립트 로드 시간:', new Date().toISOString());

// 한국 HR 뉴스 데이터
const newsData = [
    {
        id: 1,
        title: "20대 후반 취업자 수 12년 만에 최대 감소",
        summary: "한국의 25-29세 청년층 취업자가 1분기 98,000명 감소하며 12년 만에 최대 폭으로 줄었습니다.",
        url: "https://www.koreaherald.com/article/10465622",
        source: "코리아헤럴드",
        category: "employment",
        date: "2025.01.27"
    },
    {
        id: 2,
        title: "대기업 100곳 중 절반, 평균 연봉 1억원 넘어",
        summary: "국내 매출 상위 100대 기업 중 55곳이 평균 연봉 1억원을 넘겼습니다.",
        url: "https://www.koreaherald.com/article/10454325",
        source: "코리아헤럴드",
        category: "salary",
        date: "2025.01.26"
    },
    {
        id: 3,
        title: "2025년 최저임금 시간당 1만 30원 결정",
        summary: "고용노동부가 2025년 적용 최저임금을 시간급 1만 30원으로 결정했습니다.",
        url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=16902",
        source: "고용노동부",
        category: "salary",
        date: "2025.01.25"
    },
    {
        id: 4,
        title: "한국 기술 분야 취업 가이드 2025",
        summary: "AI, 사이버보안, 클라우드 컴퓨팅 전문가에 대한 수요가 급증하고 있습니다.",
        url: "https://www.nucamp.co/blog/coding-bootcamp-south-korea-kor-getting-a-job-in-tech-in-south-korea-in-2025-the-complete-guide",
        source: "Nucamp",
        category: "employment",
        date: "2025.01.24"
    },
    {
        id: 5,
        title: "2025년 1월 고용동향 발표",
        summary: "취업자가 전년 동월 대비 13만 5천명 증가했습니다.",
        url: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156674317",
        source: "정책브리핑",
        category: "employment",
        date: "2025.01.23"
    },
    {
        id: 6,
        title: "2025년 노동시장 전망",
        summary: "의료와 기술 분야는 호황을 누리고 있지만, 건설업 부진이 지속되고 있습니다.",
        url: "https://koreapro.org/2025/01/job-market-struggles-highlight-south-koreas-economic-vulnerabilities-in-2025/",
        source: "Korea Pro",
        category: "employment",
        date: "2025.01.22"
    },
    {
        id: 7,
        title: "이제는 마음을 채우는 조직문화가 답이다",
        summary: "MZ세대의 가심비를 채우는 조직문화 혁신이 공공부문을 중심으로 확산되고 있습니다.",
        url: "https://www.korea.kr/news/contributePolicyView.do?newsId=148928950",
        source: "정책브리핑",
        category: "culture",
        date: "2024.05.09"
    },
    {
        id: 8,
        title: "2025, 우리의 일터는 건강한가?",
        summary: "세대 갈등과 조직문화 변화 속에서 한국 직장 문화의 현주소를 짚어봅니다.",
        url: "http://www.newshyu.com/news/articleView.html?idxno=1017608",
        source: "뉴스H",
        category: "culture",
        date: "2025.02.26"
    },
    {
        id: 9,
        title: "가족 같은 직장 문화? 난 그런거 싫어요",
        summary: "MZ세대에게는 되레 마이너스인 '가족 같은 문화', 중소기업의 조직문화 혁신이 필요합니다.",
        url: "https://www.mk.co.kr/news/business/11014288",
        source: "매일경제",
        category: "culture",
        date: "2024.05.13"
    },
    {
        id: 10,
        title: "참여와혁신이 뽑은 2024년 노동뉴스 50",
        summary: "삼성전자 첫 파업, 아리셀 화재 참사, 대법원 통상임금 기준 변경 등 2024년 주요 노동 이슈들을 정리했습니다.",
        url: "https://www.laborplus.co.kr/news/articleView.html?idxno=34946",
        source: "참여와혁신",
        category: "labor-relations",
        date: "2025.01.01"
    },
    {
        id: 11,
        title: "조선업계, 호황에도 '노조파업·인력부족' 잠재리스크 여전",
        summary: "국내 조선업계가 호황기에도 불구하고 노사 갈등과 인력난 문제가 지속되고 있습니다.",
        url: "https://www.sisajournal-e.com/news/articleView.html?idxno=411685",
        source: "시사저널e",
        category: "labor-relations",
        date: "2025.05.12"
    },
    {
        id: 12,
        title: "현대차 노조, 윤석열 대통령 퇴진 요구하며 파업 예고",
        summary: "현대자동차 노조가 계엄령 선포 논란과 관련해 대통령 퇴진을 요구하며 파업을 예고했습니다.",
        url: "https://www.automotivemanufacturingsolutions.com/asia/hyundai-union-to-strike-unless-south-korean-president-yoon-resigns/46490.article",
        source: "AMS",
        category: "labor-relations",
        date: "2024.12.04"
    },
    {
        id: 13,
        title: "삼성전자 사상 첫 파업 단행",
        summary: "삼성전자 노동조합이 회사 역사상 처음으로 파업을 단행하며 임금 인상과 복지 개선을 요구했습니다.",
        url: "https://www.nytimes.com/2024/06/06/business/samsung-first-strike-chips.html",
        source: "뉴욕타임스",
        category: "labor-relations",
        date: "2024.06.06"
    },
    {
        id: 14,
        title: "한전, 2025년도 신입사원 700명 채용",
        summary: "한국전력이 연간 700명 규모의 신규 정규직 채용과 900명 규모의 체험형 인턴제도를 운영합니다.",
        url: "http://mustnews.co.kr/View.aspx?No=3561983",
        source: "머스트뉴스",
        category: "recruitment",
        date: "2025.03.04"
    },
    {
        id: 15,
        title: "2025년 꼭 알아야 할 취업 정책",
        summary: "여성새일센터 지원 확대, 청년일자리도약장려금, 모바일 잡케어 서비스 등 2025년 주요 취업 지원 정책을 소개합니다.",
        url: "https://www.korea.kr/news/policyNewsView.do?newsId=148939358",
        source: "정책브리핑",
        category: "employment",
        date: "2025.02.10"
    },
    {
        id: 16,
        title: "청년일자리도약장려금 254억원 추가, 지원대상 확대",
        summary: "추경에 청년일자리도약장려금 254억원이 추가되어 대학교 졸업예정자 7000명을 추가 지원합니다.",
        url: "http://www.100news.kr/74068",
        source: "백뉴스",
        category: "employment",
        date: "2025.05.14"
    }
];

// DOM 요소
const newsContainer = document.getElementById('newsContainer');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');

// 카테고리 이름 변환
function getCategoryName(category) {
    const categories = {
        recruitment: "채용",
        salary: "연봉", 
        culture: "조직문화",
        "labor-relations": "노사관계",
        employment: "취업",
        resignation: "퇴사",
        welfare: "복리후생",
        worklife: "워라밸"
    };
    return categories[category] || "기타";
}

// 뉴스 표시
function displayNews(data) {
    console.log("뉴스 표시 함수 실행", data.length + "개 뉴스");
    
    const container = document.getElementById("newsContainer");
    
    if (!container) {
        console.error("newsContainer를 찾을 수 없습니다.");
        return;
    }
    
    if (data.length === 0) {
        container.innerHTML = '<div class="loading">검색 결과가 없습니다.</div>';
        return;
    }
    
    container.innerHTML = "";
    
    data.forEach(news => {
        const newsHTML = `
            <div class="news-item" onclick="window.open('${news.url}', '_blank')">
                <div class="news-category">${getCategoryName(news.category)}</div>
                <h3 class="news-title">${news.title}</h3>
                <p>${news.summary}</p>
                <div class="news-source">
                    <span>${news.source}</span>
                    <span>${news.date}</span>
                </div>
            </div>
        `;
        container.innerHTML += newsHTML;
    });
    
    console.log("뉴스 표시 완료");
}

// 뉴스 필터링
function filterNews() {
    console.log("필터링 함수 실행");
    
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    
    if (!searchInput || !categoryFilter) {
        console.error("검색 요소를 찾을 수 없습니다.");
        return;
    }
    
    const search = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    
    console.log("검색어:", search, "카테고리:", category);
    
    let filtered = [...newsData];
    
    // 카테고리 필터링
    if (category !== "all") {
        filtered = filtered.filter(news => news.category === category);
    }
    
    // 검색어 필터링
    if (search) {
        filtered = filtered.filter(news => 
            news.title.toLowerCase().includes(search) ||
            news.summary.toLowerCase().includes(search) ||
            news.source.toLowerCase().includes(search)
        );
    }
    
    console.log("필터링 결과:", filtered.length + "개");
    displayNews(filtered);
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function() {
    console.log("한국 HR 뉴스 사이트 로드 시작");
    
    // 업데이트 날짜 설정
    const updateDate = document.getElementById("updateDate");
    if (updateDate) {
        const today = new Date();
        const dateString = today.toLocaleDateString("ko-KR") + " 업데이트";
        updateDate.textContent = dateString;
        console.log("업데이트 날짜 설정:", dateString);
    }
    
    // 초기 뉴스 표시
    displayNews(newsData);
    
    // 이벤트 리스너 등록
    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
        searchButton.addEventListener("click", filterNews);
        console.log("검색 버튼 이벤트 등록 완료");
    }
    
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                filterNews();
            }
        });
        console.log("검색 입력 이벤트 등록 완료");
    }
    
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterNews);
        console.log("카테고리 필터 이벤트 등록 완료");
    }
    
    console.log("한국 HR 뉴스 사이트 로드 완료");
}); 