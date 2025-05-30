// 뉴스 데이터 (실제로는 API에서 가져올 예정)
const mockNewsData = [
    {
        id: 1,
        title: '한국은행, 기준금리 동결 결정',
        summary: '한국은행 금융통화위원회가 오늘 기준금리를 현행 3.50%에서 동결하기로 결정했습니다. 이는 시장의 예상과 일치하는 결과입니다.',
        url: '#',
        source: '경제일보',
        date: '2024-07-10',
        category: 'policy',
        imageUrl: 'https://picsum.photos/id/10/600/400'
    },
    {
        id: 2,
        title: '2분기 경제성장률 2.3%, 예상치 상회',
        summary: '한국 경제가 2분기에 2.3% 성장하며 예상치를 상회했습니다. 수출 증가와 내수 회복이 주요 원인으로 분석됩니다.',
        url: '#',
        source: '한국경제',
        date: '2024-07-09',
        category: 'market',
        imageUrl: 'https://picsum.photos/id/20/600/400'
    },
    {
        id: 3,
        title: '반도체 수출 6개월 연속 증가세',
        summary: '한국의 반도체 수출이 6개월 연속 증가세를 보이고 있습니다. 이는 글로벌 AI 수요 증가와 메모리 가격 회복에 따른 결과입니다.',
        url: '#',
        source: '산업경제',
        date: '2024-07-08',
        category: 'industry',
        imageUrl: 'https://picsum.photos/id/30/600/400'
    },
    {
        id: 4,
        title: '미 연준, 9월 금리인하 가능성 시사',
        summary: '미국 연방준비제도(Fed)가 9월 금리인하 가능성을 시사했습니다. 이에 따라 국내 금융시장에도 영향이 있을 것으로 예상됩니다.',
        url: '#',
        source: '글로벌경제',
        date: '2024-07-07',
        category: 'global',
        imageUrl: 'https://picsum.photos/id/40/600/400'
    },
    {
        id: 5,
        title: '정부, 경제 활성화 위한 추경 편성 검토',
        summary: '정부가 경제 활성화를 위한 추가경정예산 편성을 검토 중입니다. 주요 항목으로는 중소기업 지원과 취약계층 지원이 포함될 것으로 보입니다.',
        url: '#',
        source: '정책뉴스',
        date: '2024-07-06',
        category: 'policy',
        imageUrl: 'https://picsum.photos/id/50/600/400'
    },
    {
        id: 6,
        title: '코스피, 3,200선 회복',
        summary: '코스피 지수가 3,200선을 회복했습니다. 외국인 매수세와 기업 실적 개선 기대감이 상승 요인으로 작용했습니다.',
        url: '#',
        source: '증권일보',
        date: '2024-07-05',
        category: 'market',
        imageUrl: 'https://picsum.photos/id/60/600/400'
    }
];

// DOM 요소
const newsContainer = document.getElementById('newsContainer');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');

// 뉴스 아이템 생성 함수
function createNewsItem(news) {
    return `
        <div class="news-item">
            <img src="${news.imageUrl}" alt="${news.title}">
            <div class="news-content">
                <span class="news-category">${getCategoryName(news.category)}</span>
                <h3 class="news-title"><a href="${news.url}" target="_blank">${news.title}</a></h3>
                <p>${news.summary}</p>
                <div class="news-source">
                    <span>${news.source}</span>
                    <span>${formatDate(news.date)}</span>
                </div>
            </div>
        </div>
    `;
}

// 카테고리 이름 변환 함수
function getCategoryName(category) {
    const categories = {
        'market': '주식시장',
        'industry': '산업동향',
        'policy': '정책/제도',
        'global': '국제경제',
        'all': '전체'
    };
    return categories[category] || '기타';
}

// 날짜 포맷 함수
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 뉴스 표시 함수
function displayNews(newsData) {
    if (newsData.length === 0) {
        newsContainer.innerHTML = '<div class="loading">검색 결과가 없습니다.</div>';
        return;
    }
    
    newsContainer.innerHTML = '';
    newsData.forEach(news => {
        newsContainer.innerHTML += createNewsItem(news);
    });
}

// 뉴스 필터링 함수
function filterNews() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    let filteredNews = mockNewsData;
    
    // 카테고리 필터링
    if (category !== 'all') {
        filteredNews = filteredNews.filter(news => news.category === category);
    }
    
    // 검색어 필터링
    if (searchTerm) {
        filteredNews = filteredNews.filter(news => 
            news.title.toLowerCase().includes(searchTerm) || 
            news.summary.toLowerCase().includes(searchTerm)
        );
    }
    
    displayNews(filteredNews);
}

// 이벤트 리스너
searchButton.addEventListener('click', filterNews);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        filterNews();
    }
});
categoryFilter.addEventListener('change', filterNews);

// 초기 뉴스 로드
function loadInitialNews() {
    setTimeout(() => {
        displayNews(mockNewsData);
    }, 1000); // 로딩 시간 시뮬레이션
}

// 실제 API에서 뉴스 데이터 가져오기 (향후 구현)
async function fetchNewsFromAPI() {
    // 실제 구현 시 여기에 API 호출 코드 작성
    // const response = await fetch('https://api.example.com/news');
    // const data = await response.json();
    // return data;
    
    // 현재는 목업 데이터 반환
    return new Promise(resolve => {
        setTimeout(() => resolve(mockNewsData), 1000);
    });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    loadInitialNews();
}); 