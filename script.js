// 현재 날짜 설정 (항상 현재 시점 기준)
console.log('스크립트 로드 시간:', new Date().toISOString());

// 뉴스 데이터 (실제로는 API에서 가져올 예정)
const mockNewsData = [
    {
        id: 1,
        title: '한국은행, 기준금리 3.0% 동결...원화 약세·트럼프 불확실성 고려',
        summary: '한국은행이 기준금리를 3.0%로 동결했습니다. 원화 약세와 트럼프 행정부의 정책 불확실성을 고려한 결정으로 분석됩니다.',
        url: 'https://en.yna.co.kr/view/AEN20250116003452320',
        source: '연합뉴스(영문)',
        category: 'policy',
        dayOffset: 0, // 오늘
        imageUrl: 'https://picsum.photos/id/10/600/400'
    },
    {
        id: 2,
        title: '삼성전자 1분기 매출 79조원 "사상 최대"...갤럭시S25 판매 호조',
        summary: '삼성전자가 1분기 매출 79.14조원을 기록하며 사상 최대 분기 매출을 달성했습니다. 갤럭시S25 시리즈 판매 호조가 주요 원인으로 분석됩니다.',
        url: 'https://www.thelec.kr/news/articleView.html?idxno=35531',
        source: '디일렉',
        category: 'industry',
        dayOffset: 1, // 어제
        imageUrl: 'https://picsum.photos/id/20/600/400'
    },
    {
        id: 3,
        title: '삼성전자 영업이익 21.7% 증가...갤럭시S25 강세에도 반도체 부진',
        summary: '삼성전자의 1분기 순이익이 21.7% 증가했습니다. 갤럭시S25 강세에도 불구하고 HBM 등 반도체 사업은 여전히 부진을 면치 못하고 있습니다.',
        url: 'https://www.sammobile.com/news/samsung-profit-q1-2025-rises-21-7-percent-galaxy-s25-sales/',
        source: 'SamMobile',
        category: 'industry',
        dayOffset: 2, // 2일 전
        imageUrl: 'https://picsum.photos/id/30/600/400'
    },
    {
        id: 4,
        title: '미 연준 금리 동결이 한국은행에 압박...한미 금리 격차 1.5%p 유지',
        summary: '미국 연방준비제도의 금리 동결로 한국은행이 통화정책 완화 속도를 늦출 것으로 전망됩니다. 한미 금리 격차는 1.5%포인트로 유지되었습니다.',
        url: 'https://www.koreaherald.com/article/10408713',
        source: '코리아헤럴드',
        category: 'global',
        dayOffset: 3, // 3일 전
        imageUrl: 'https://picsum.photos/id/40/600/400'
    },
    {
        id: 5,
        title: '한국 2025년 경기 전망 어두워져...성장률 2% 하회 가능성',
        summary: '한국 경제가 2025년 성장률 2% 하회 가능성이 높아지고 있습니다. 정치적 불확실성과 외부 요인으로 인한 경기 둔화 우려가 커지고 있습니다.',
        url: 'https://koreajoongangdaily.joins.com/news/2025-01-01/business/economy/Korea-enters-2025-on-backfoot-amid-won-woes-glum-growth-outlook/2212636',
        source: '코리아중앙데일리',
        category: 'policy',
        dayOffset: 4, // 4일 전
        imageUrl: 'https://picsum.photos/id/50/600/400'
    },
    {
        id: 6,
        title: '삼성전자 스마트폰 강세로 반도체 부진 상쇄...1분기 실적 선방',
        summary: '삼성전자가 스마트폰 사업의 강세로 반도체 부진을 상쇄하며 1분기 실적에서 선방했습니다. DX 부문이 전체 실적을 견인한 것으로 나타났습니다.',
        url: 'https://www.digitimes.com/news/a20250430PD225/samsung-revenue-business-sales-operating-profit.html',
        source: 'Digitimes',
        category: 'market',
        dayOffset: 5, // 5일 전
        imageUrl: 'https://picsum.photos/id/60/600/400'
    }
];

// DOM 요소
const newsContainer = document.getElementById('newsContainer');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');

// 날짜 계산 함수
function getDateFromOffset(dayOffset) {
    // 항상 새로운 현재 날짜를 생성
    const today = new Date();
    const result = new Date(today);
    result.setDate(today.getDate() - dayOffset);
    
    console.log(`날짜 계산: offset=${dayOffset}, 시작 날짜=${today.toLocaleDateString()}, 결과=${result.toLocaleDateString()}`);
    return result;
}

// 뉴스 아이템 생성 함수
function createNewsItem(news) {
    // 날짜 계산
    const newsDate = getDateFromOffset(news.dayOffset);
    const formattedDate = formatDate(newsDate);
    
    console.log(`뉴스 ID: ${news.id}, 제목: ${news.title}, dayOffset: ${news.dayOffset}, 날짜: ${formattedDate}`);
    
    return `
        <div class="news-item" data-url="${news.url}" style="cursor: pointer;">
            <img src="${news.imageUrl}" alt="${news.title}">
            <div class="news-content">
                <span class="news-category">${getCategoryName(news.category)}</span>
                <h3 class="news-title">
                    <a href="${news.url}" target="_blank" rel="noopener noreferrer">
                        ${news.title}
                    </a>
                </h3>
                <p>${news.summary}</p>
                <div class="news-source">
                    <span>${news.source}</span>
                    <span>${formattedDate}</span>
                </div>
                <div class="news-link">
                    <small>클릭하여 전체 기사 보기 →</small>
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
function formatDate(date) {
    // 날짜가 유효한지 확인
    if (isNaN(date.getTime())) {
        console.error('유효하지 않은 날짜:', date);
        return '날짜 오류';
    }
    
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
    
    // 클릭 이벤트 리스너 추가
    addNewsItemClickListeners();
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
    console.log('초기 뉴스 로드 시작...');
    
    setTimeout(() => {
        displayNews(mockNewsData);
        console.log('뉴스 로드 완료');
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

// 뉴스 아이템 클릭 이벤트 리스너 추가
function addNewsItemClickListeners() {
    const newsItems = document.querySelectorAll('.news-item');
    
    newsItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // 링크나 버튼이 클릭된 경우 이벤트 전파 중지
            if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON') {
                return;
            }
            
            const url = this.getAttribute('data-url');
            console.log('뉴스 카드 클릭됨, URL:', url);
            
            if (url && url !== '#') {
                // 새 탭에서 열기 시도
                const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                
                // 팝업이 차단된 경우 현재 탭에서 열기
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    console.log('팝업이 차단되어 현재 탭에서 열기');
                    window.location.href = url;
                } else {
                    console.log('새 탭에서 열기 성공');
                }
            } else {
                console.log('유효하지 않은 URL:', url);
            }
        });
        
        // 호버 효과를 위한 마우스 이벤트
        item.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    console.log('페이지 로드 완료, 현재 날짜:', currentDate.toLocaleDateString('ko-KR'));
    console.log('현재 날짜 상세:', currentDate.toString());
    
    // 업데이트 날짜 설정
    const updateDateElement = document.getElementById('updateDate');
    if (updateDateElement) {
        const formattedCurrentDate = currentDate.toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '');
        updateDateElement.textContent = `${formattedCurrentDate} 업데이트`;
        console.log('업데이트 날짜 설정:', formattedCurrentDate);
    }
    
    loadInitialNews();
}); 