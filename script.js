// 현재 날짜 설정 (항상 현재 시점 기준)
console.log('스크립트 로드 시간:', new Date().toISOString());

// 뉴스 데이터 (실제로는 API에서 가져올 예정)
const mockNewsData = [
    {
        id: 1,
        title: '한국은행 기준금리 현행 유지...물가 안정 기조 지속',
        summary: '한국은행 금융통화위원회가 기준금리를 현행 3.50%에서 동결하기로 결정했습니다. 물가 안정을 위한 긴축 기조를 유지하겠다는 입장을 밝혔습니다.',
        url: 'https://n.news.naver.com/mnews/article/001/0014654321?sid=101',
        source: '연합뉴스',
        category: 'policy',
        dayOffset: 0, // 오늘
        imageUrl: 'https://picsum.photos/id/10/600/400'
    },
    {
        id: 2,
        title: '삼성전자 3분기 영업이익 급증...반도체 회복세',
        summary: '삼성전자가 3분기 연결 기준 영업이익이 전년 동기 대비 크게 증가했다고 발표했습니다. 메모리 반도체 가격 상승이 주요 원인으로 분석됩니다.',
        url: 'https://n.news.naver.com/mnews/article/015/0004954123?sid=101',
        source: '한국경제',
        category: 'industry',
        dayOffset: 1, // 어제
        imageUrl: 'https://picsum.photos/id/20/600/400'
    },
    {
        id: 3,
        title: 'SK하이닉스, HBM 수요 급증으로 실적 개선',
        summary: 'SK하이닉스가 AI용 고대역폭 메모리(HBM) 수요 급증에 힘입어 매출과 영업이익이 크게 개선됐다고 발표했습니다.',
        url: 'https://n.news.naver.com/mnews/article/277/0005443210?sid=101',
        source: '아시아경제',
        category: 'industry',
        dayOffset: 2, // 2일 전
        imageUrl: 'https://picsum.photos/id/30/600/400'
    },
    {
        id: 4,
        title: '원/달러 환율 1,380원대...연준 금리정책 주목',
        summary: '원/달러 환율이 1,380원대에서 등락을 보이고 있습니다. 미국 연방준비제도의 통화정책 방향성에 따라 변동성이 확대될 것으로 전망됩니다.',
        url: 'https://n.news.naver.com/mnews/article/018/0005654987?sid=101',
        source: '이데일리',
        category: 'global',
        dayOffset: 3, // 3일 전
        imageUrl: 'https://picsum.photos/id/40/600/400'
    },
    {
        id: 5,
        title: '기획재정부, 내년 예산안 677조원 편성',
        summary: '기획재정부가 내년도 정부 예산안을 677조원 규모로 편성했다고 발표했습니다. 민생 안정과 경제 활력 제고에 중점을 둔 것으로 나타났습니다.',
        url: 'https://n.news.naver.com/mnews/article/008/0004921654?sid=101',
        source: '머니투데이',
        category: 'policy',
        dayOffset: 4, // 4일 전
        imageUrl: 'https://picsum.photos/id/50/600/400'
    },
    {
        id: 6,
        title: 'KOSPI 2,600선 근접...외국인 순매수 지속',
        summary: 'KOSPI 지수가 2,600선에 근접하며 상승세를 보이고 있습니다. 외국인 투자자들의 순매수가 지속되면서 지수 상승을 견인하고 있습니다.',
        url: 'https://n.news.naver.com/mnews/article/009/0005332187?sid=101',
        source: '매일경제',
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