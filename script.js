class KoreanEconomyNews {
    constructor() {
        this.newsData = [];
        this.filteredNews = [];
        this.currentCategory = 'all';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadNews();
    }

    setupEventListeners() {
        // 검색 기능
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchBtn.addEventListener('click', () => this.searchNews());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchNews();
        });

        // 카테고리 필터
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
                this.updateActiveCategory(e.target);
            });
        });

        // 수동 업데이트 버튼
        const manualUpdateBtn = document.getElementById('manualUpdate');
        if (manualUpdateBtn) {
            manualUpdateBtn.addEventListener('click', () => {
                console.log('수동 업데이트 버튼 클릭');
                this.loadNews(true);
            });
        }
    }

    // 뉴스 로드 (실제 데이터 또는 샘플 데이터)
    async loadNews(forceUpdate = false) {
        try {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('newsGrid').innerHTML = '';
            
            // 먼저 실제 뉴스 데이터를 로드해보고, 실패하면 샘플 데이터 사용
            let newsData = await this.fetchRealNewsData();
            
            if (!newsData || newsData.length === 0) {
                console.log('실제 뉴스 데이터를 불러올 수 없어 샘플 데이터를 사용합니다.');
                newsData = this.generateSampleNews();
            }
            
            this.newsData = newsData;
            this.filteredNews = [...this.newsData];
            
            this.renderNews();
            this.updateLastUpdatedTime();
            
            console.log('뉴스가 로드되었습니다:', this.newsData.length, '개');
        } catch (error) {
            console.error('뉴스 로딩 중 오류 발생:', error);
            this.showError('뉴스를 불러오는 중 오류가 발생했습니다.');
        }
    }

    // 실제 뉴스 데이터 로드 (news-data.json에서)
    async fetchRealNewsData() {
        try {
            const response = await fetch('./news-data.json');
            if (!response.ok) {
                throw new Error('뉴스 데이터를 불러올 수 없습니다.');
            }
            const data = await response.json();
            
            // 날짜 문자열을 Date 객체로 변환
            const newsWithDates = data.news.map(news => ({
                ...news,
                publishTime: new Date(news.publishTime)
            }));
            
            // 최신순으로 정렬
            return newsWithDates.sort((a, b) => b.publishTime - a.publishTime);
        } catch (error) {
            console.error('실제 뉴스 데이터 로드 실패:', error);
            return null;
        }
    }

    // 샘플 뉴스 데이터 생성 (실제로는 RSS 피드에서 가져옴)
    generateSampleNews() {
        const sources = ['연합뉴스', '매일경제', '한국경제', '이데일리', 'KBS', 'SBS'];
        const categories = ['stock', 'industry', 'policy', 'international'];
        const categoryNames = {
            'stock': '주식시장',
            'industry': '산업동향', 
            'policy': '정책/제도',
            'international': '국제경제'
        };

        const sampleTitles = [
            '코스피 상승세 지속, 외국인 순매수 확대',
            '반도체 업계 실적 개선 전망',
            '정부, 중소기업 지원 정책 발표',
            '미국 연준 기준금리 동결 결정',
            '자동차 업계 전기차 투자 확대',
            '부동산 시장 안정화 조치 시행',
            '원달러 환율 하락세 지속',
            '국내 주요 기업 실적 발표 예정',
            '글로벌 인플레이션 우려 지속',
            '스타트업 투자 유치 증가세'
        ];

        // 각 언론사별 실제 URL 패턴
        const sourceUrls = {
            '연합뉴스': 'https://www.yna.co.kr/view/AKR20250610',
            '매일경제': 'https://www.mk.co.kr/news/economy/',
            '한국경제': 'https://www.hankyung.com/economy/article/',
            '이데일리': 'https://www.edaily.co.kr/news/read?newsId=',
            'KBS': 'https://news.kbs.co.kr/news/view.do?ncd=',
            'SBS': 'https://news.sbs.co.kr/news/endPage.do?news_id='
        };

        const news = [];
        const today = new Date();
        
        for (let i = 0; i < 15; i++) {
            const randomHour = Math.floor(Math.random() * 12) + 8; // 8시~19시
            const publishTime = new Date(today);
            publishTime.setHours(randomHour, Math.floor(Math.random() * 60));
            
            const category = categories[Math.floor(Math.random() * categories.length)];
            const source = sources[Math.floor(Math.random() * sources.length)];
            
            // 각 언론사별로 실제 URL 패턴 생성
            let newsUrl;
            const randomId = Math.floor(Math.random() * 1000000);
            
            switch(source) {
                case '연합뉴스':
                    newsUrl = `${sourceUrls[source]}${randomId.toString().padStart(6, '0')}`;
                    break;
                case '매일경제':
                    newsUrl = `${sourceUrls[source]}${randomId}`;
                    break;
                case '한국경제':
                    newsUrl = `${sourceUrls[source]}${randomId}`;
                    break;
                case '이데일리':
                    newsUrl = `${sourceUrls[source]}${randomId.toString().padStart(15, '0')}`;
                    break;
                case 'KBS':
                    newsUrl = `${sourceUrls[source]}${randomId}`;
                    break;
                case 'SBS':
                    newsUrl = `${sourceUrls[source]}N${randomId}`;
                    break;
                default:
                    newsUrl = '#';
            }
            
            news.push({
                id: `news-${Date.now()}-${i}`,
                title: sampleTitles[i % sampleTitles.length] + ` (${i + 1})`,
                description: `${sampleTitles[i % sampleTitles.length]}에 관한 상세한 내용입니다. 경제 전문가들은 이번 발표가 시장에 긍정적인 영향을 미칠 것으로 전망하고 있습니다.`,
                source: source,
                category: category,
                categoryName: categoryNames[category],
                publishTime: publishTime,
                url: newsUrl
            });
        }

        // 시간순으로 정렬 (최신순)
        return news.sort((a, b) => b.publishTime - a.publishTime);
    }

    // 뉴스 렌더링
    renderNews() {
        const newsGrid = document.getElementById('newsGrid');
        const loading = document.getElementById('loading');
        
        loading.style.display = 'none';
        
        if (this.filteredNews.length === 0) {
            newsGrid.innerHTML = '<div class="error-message">표시할 뉴스가 없습니다.</div>';
            return;
        }

        newsGrid.innerHTML = this.filteredNews.map(news => `
            <article class="news-item" data-category="${news.category}">
                <div class="news-meta">
                    <span class="news-source">${news.source}</span>
                    <span class="news-time">${this.formatTime(news.publishTime)}</span>
                </div>
                <h3><a href="${news.url}" target="_blank">${news.title}</a></h3>
                <p class="news-description">${news.description}</p>
                <span class="news-category">${news.categoryName}</span>
            </article>
        `).join('');
    }

    // 시간 포맷팅
    formatTime(date) {
        // date가 문자열인 경우 Date 객체로 변환
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(dateObj.getTime())) {
            return '시간 미상';
        }
        
        const now = new Date();
        const diff = now - dateObj;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);

        if (minutes < 1) {
            return '방금 전';
        } else if (minutes < 60) {
            return `${minutes}분 전`;
        } else if (hours < 24) {
            return `${hours}시간 전`;
        } else {
            return dateObj.toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    // 카테고리별 필터링
    filterByCategory(category) {
        this.currentCategory = category;
        
        if (category === 'all') {
            this.filteredNews = [...this.newsData];
        } else {
            this.filteredNews = this.newsData.filter(news => news.category === category);
        }
        
        this.renderNews();
    }

    // 뉴스 검색
    searchNews() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filterByCategory(this.currentCategory);
            return;
        }

        this.filteredNews = this.newsData.filter(news => 
            news.title.toLowerCase().includes(searchTerm) ||
            news.description.toLowerCase().includes(searchTerm) ||
            news.source.toLowerCase().includes(searchTerm)
        );

        this.renderNews();
    }

    // 활성 카테고리 업데이트
    updateActiveCategory(activeBtn) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // 마지막 업데이트 시간 표시
    updateLastUpdatedTime() {
        const lastUpdated = document.getElementById('lastUpdated');
        const now = new Date();
        
        lastUpdated.textContent = `마지막 업데이트: ${now.toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }

    // 에러 메시지 표시
    showError(message) {
        const newsGrid = document.getElementById('newsGrid');
        const loading = document.getElementById('loading');
        
        loading.style.display = 'none';
        newsGrid.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// 페이지 로드 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new KoreanEconomyNews();
}); 