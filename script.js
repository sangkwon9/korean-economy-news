// 현재 날짜 설정 (항상 현재 시점 기준)
console.log('스크립트 로드 시간:', new Date().toISOString());

// 뉴스 데이터 (실제로는 API에서 가져올 예정)
const mockNewsData = [
    {
        id: 1,
        title: '한국은행, 기준금리 동결 결정',
        summary: '한국은행 금융통화위원회가 오늘 기준금리를 현행 3.50%에서 동결하기로 결정했습니다. 이는 시장의 예상과 일치하는 결과입니다.',
        url: 'https://www.bok.or.kr',
        source: '한국은행',
        category: 'policy',
        dayOffset: 0, // 오늘
        imageUrl: 'https://picsum.photos/id/10/600/400'
    },
    {
        id: 2,
        title: '2분기 경제성장률 2.3%, 예상치 상회',
        summary: '한국 경제가 2분기에 2.3% 성장하며 예상치를 상회했습니다. 수출 증가와 내수 회복이 주요 원인으로 분석됩니다.',
        url: 'https://news.naver.com/section/101',
        source: '네이버 경제뉴스',
        category: 'market',
        dayOffset: 1, // 어제
        imageUrl: 'https://picsum.photos/id/20/600/400'
    },
    {
        id: 3,
        title: '반도체 수출 6개월 연속 증가세',
        summary: '한국의 반도체 수출이 6개월 연속 증가세를 보이고 있습니다. 이는 글로벌 AI 수요 증가와 메모리 가격 회복에 따른 결과입니다.',
        url: 'https://www.mk.co.kr',
        source: '매일경제',
        category: 'industry',
        dayOffset: 2, // 2일 전
        imageUrl: 'https://picsum.photos/id/30/600/400'
    },
    {
        id: 4,
        title: '미 연준, 9월 금리인하 가능성 시사',
        summary: '미국 연방준비제도(Fed)가 9월 금리인하 가능성을 시사했습니다. 이에 따라 국내 금융시장에도 영향이 있을 것으로 예상됩니다.',
        url: 'https://www.google.com/search?q=미국+연준+금리인하',
        source: '경제뉴스 검색',
        category: 'global',
        dayOffset: 3, // 3일 전
        imageUrl: 'https://picsum.photos/id/40/600/400'
    },
    {
        id: 5,
        title: '정부, 경제 활성화 위한 추경 편성 검토',
        summary: '정부가 경제 활성화를 위한 추가경정예산 편성을 검토 중입니다. 주요 항목으로는 중소기업 지원과 취약계층 지원이 포함될 것으로 보입니다.',
        url: 'https://www.edaily.co.kr',
        source: '이데일리',
        category: 'policy',
        dayOffset: 4, // 4일 전
        imageUrl: 'https://picsum.photos/id/50/600/400'
    },
    {
        id: 6,
        title: '코스피, 3,200선 회복',
        summary: '코스피 지수가 3,200선을 회복했습니다. 외국인 매수세와 기업 실적 개선 기대감이 상승 요인으로 작용했습니다.',
        url: 'https://finance.yahoo.com',
        source: '야후 파이낸스',
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