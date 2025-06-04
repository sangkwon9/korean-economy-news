// 현재 날짜 설정 (항상 현재 시점 기준)
console.log('스크립트 로드 시간:', new Date().toISOString());

// 뉴스 데이터 (JSON 파일에서 로드)
let newsData = [];
let lastUpdateTime = '';

// DOM 요소
const newsContainer = document.getElementById('newsContainer');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');

// 카테고리 이름 변환 (한국경제 뉴스에 맞게 수정)
function getCategoryName(category) {
    const categories = {
        stock: "주식시장",
        industry: "산업동향", 
        policy: "정책/제도",
        international: "국제경제",
        employment: "취업/고용",
        finance: "금융",
        realestate: "부동산",
        startup: "스타트업"
    };
    return categories[category] || "기타";
}

// JSON 파일에서 뉴스 데이터 로드
async function loadNewsData() {
    try {
        console.log('📰 뉴스 데이터 로드 중...');
        
        const response = await fetch('news-data.json?v=' + Date.now());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        newsData = data.news || [];
        lastUpdateTime = data.updateTime || '';
        
        console.log(`✅ ${newsData.length}개 뉴스 로드 완료`);
        console.log('📅 마지막 업데이트:', lastUpdateTime);
        
        // 업데이트 시간 표시
        const updateDateElement = document.getElementById("updateDate");
        if (updateDateElement && lastUpdateTime) {
            updateDateElement.textContent = `${lastUpdateTime} 업데이트`;
        }
        
        return newsData;
        
    } catch (error) {
        console.error('❌ 뉴스 데이터 로드 실패:', error);
        
        // 백업 데이터 사용
        newsData = getBackupNews();
        
        const updateDateElement = document.getElementById("updateDate");
        if (updateDateElement) {
            updateDateElement.textContent = "업데이트 중... (백업 데이터 표시)";
        }
        
        return newsData;
    }
}

// 백업 뉴스 데이터 (JSON 로드 실패 시 사용)
function getBackupNews() {
    return [
        {
            id: 1,
            title: "코스피 3000선 돌파, 외국인 매수세 지속",
            summary: "코스피가 3000선을 돌파하며 강세를 보이고 있고, 외국인 투자자들의 매수세가 이어지고 있습니다.",
            url: "#",
            source: "한국경제",
            category: "stock",
            date: new Date().toLocaleDateString("ko-KR").replace(/\./g, '.').slice(0, -1),
            popularity: 95
        },
        {
            id: 2,
            title: "반도체 수출 3개월 연속 증가세",
            summary: "한국의 반도체 수출이 3개월 연속 증가하며 경기 회복 신호를 보이고 있습니다.",
            url: "#",
            source: "매일경제",
            category: "industry",
            date: new Date().toLocaleDateString("ko-KR").replace(/\./g, '.').slice(0, -1),
            popularity: 89
        },
        {
            id: 3,
            title: "한국은행 기준금리 동결 결정",
            summary: "한국은행이 기준금리를 현 수준으로 유지하기로 결정했습니다.",
            url: "#",
            source: "연합뉴스",
            category: "policy",
            date: new Date().toLocaleDateString("ko-KR").replace(/\./g, '.').slice(0, -1),
            popularity: 87
        }
    ];
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
        container.innerHTML = `
            <div class="loading">
                <p>검색 결과가 없습니다.</p>
                <p>다른 검색어나 카테고리를 시도해보세요.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = "";
    
    data.forEach((news, index) => {
        const newsHTML = `
            <div class="news-item ${index < 3 ? 'featured' : ''}" onclick="window.open('${news.url}', '_blank')">
                <div class="news-header">
                    <div class="news-category">${getCategoryName(news.category)}</div>
                    ${news.popularity ? `<div class="popularity-score">🔥 ${news.popularity}</div>` : ''}
                </div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-summary">${news.summary}</p>
                <div class="news-source">
                    <span class="source-name">📰 ${news.source}</span>
                    <span class="news-date">📅 ${news.date}</span>
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
    
    // 인기도 순으로 정렬
    filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    
    console.log("필터링 결과:", filtered.length + "개");
    displayNews(filtered);
}

// 뉴스 새로고침
async function refreshNews() {
    const container = document.getElementById("newsContainer");
    if (container) {
        container.innerHTML = '<div class="loading">최신 뉴스를 불러오는 중입니다...</div>';
    }
    
    await loadNewsData();
    displayNews(newsData);
}

// 자동 새로고침 (5분마다)
function setupAutoRefresh() {
    setInterval(async () => {
        console.log('🔄 자동 뉴스 새로고침...');
        await refreshNews();
    }, 5 * 60 * 1000); // 5분
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", async function() {
    console.log("한국경제 뉴스 사이트 로드 시작");
    
    // 로딩 메시지 표시
    const container = document.getElementById("newsContainer");
    if (container) {
        container.innerHTML = '<div class="loading">한국경제 뉴스를 불러오는 중입니다...</div>';
    }
    
    // 뉴스 데이터 로드 및 표시
    await loadNewsData();
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
    
    // 새로고침 버튼 추가 (옵션)
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '🔄 새로고침';
    refreshButton.className = 'refresh-button';
    refreshButton.onclick = refreshNews;
    
    const filterSection = document.querySelector('.filter-section');
    if (filterSection) {
        filterSection.appendChild(refreshButton);
    }
    
    // 자동 새로고침 설정
    setupAutoRefresh();
    
    console.log("한국경제 뉴스 사이트 로드 완료");
}); 