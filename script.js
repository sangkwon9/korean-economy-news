class KoreanEconomyNews {
    constructor() {
        this.newsData = [];
        this.filteredNews = [];
        this.currentCategory = 'all';
        this.lastUpdateTime = null;
        this.updateScheduled = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkForUpdate();
        this.scheduleNextUpdate();
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
                this.forceUpdate();
            });
        }

        // 수동 업데이트 (디버깅용) - Ctrl+Shift+U
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'U') {
                console.log('키보드 수동 업데이트 실행');
                this.forceUpdate();
            }
        });
    }

    // 한국 시간 기준으로 다음 오후 4시까지의 시간 계산
    getNextUpdateTime() {
        // 한국 시간으로 현재 시간 가져오기
        const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
        
        // 오늘 오후 4시 설정
        const today4PM = new Date(koreaTime);
        today4PM.setHours(16, 0, 0, 0);
        
        console.log(`현재 한국 시간: ${koreaTime.toLocaleString('ko-KR')}`);
        console.log(`오늘 오후 4시: ${today4PM.toLocaleString('ko-KR')}`);
        
        // 만약 현재 시간이 오후 4시 이후라면 다음날 오후 4시로 설정
        if (koreaTime >= today4PM) {
            today4PM.setDate(today4PM.getDate() + 1);
            console.log(`다음 업데이트: 내일 오후 4시 (${today4PM.toLocaleString('ko-KR')})`);
        } else {
            console.log(`다음 업데이트: 오늘 오후 4시 (${today4PM.toLocaleString('ko-KR')})`);
        }
        
        return today4PM;
    }

    // 업데이트 스케줄링
    scheduleNextUpdate() {
        if (this.updateScheduled) return;
        
        const nextUpdate = this.getNextUpdateTime();
        const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
        const timeUntilUpdate = nextUpdate.getTime() - koreaTime.getTime();
        
        console.log(`업데이트까지 남은 시간: ${Math.floor(timeUntilUpdate / (1000 * 60))}분`);
        
        // 음수면 즉시 업데이트
        if (timeUntilUpdate <= 0) {
            console.log('즉시 업데이트 실행');
            this.updateNews();
            return;
        }
        
        setTimeout(() => {
            console.log('스케줄된 업데이트 실행');
            this.updateNews();
            this.updateScheduled = false;
            this.scheduleNextUpdate(); // 다음 업데이트 스케줄링
        }, timeUntilUpdate);
        
        this.updateScheduled = true;
    }

    // 페이지 로드 시 업데이트 확인
    checkForUpdate() {
        const lastUpdate = localStorage.getItem('lastNewsUpdate');
        const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
        
        console.log(`페이지 로드 시간 (한국): ${koreaTime.toLocaleString('ko-KR')}`);
        
        if (!lastUpdate) {
            console.log('첫 방문 - 뉴스 업데이트 실행');
            this.updateNews();
            return;
        }
        
        const lastUpdateTime = new Date(lastUpdate);
        const today4PM = new Date(koreaTime);
        today4PM.setHours(16, 0, 0, 0);
        
        console.log(`마지막 업데이트: ${lastUpdateTime.toLocaleString('ko-KR')}`);
        console.log(`오늘 오후 4시: ${today4PM.toLocaleString('ko-KR')}`);
        
        // 마지막 업데이트가 오늘 오후 4시 이전이고, 현재 시간이 오후 4시 이후라면 업데이트
        const shouldUpdate = lastUpdateTime < today4PM && koreaTime >= today4PM;
        console.log(`업데이트 필요 여부: ${shouldUpdate}`);
        
        if (shouldUpdate) {
            console.log('조건 만족 - 뉴스 업데이트 실행');
            this.updateNews();
        } else {
            console.log('캐시된 뉴스 사용');
            this.loadCachedNews();
        }
    }

    // 뉴스 업데이트
    async updateNews() {
        try {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('newsGrid').innerHTML = '';
            
            // 실제 환경에서는 RSS 피드나 뉴스 API를 사용
            const newsData = await this.fetchNewsData();
            
            this.newsData = newsData;
            this.filteredNews = [...this.newsData];
            
            // 로컬 스토리지에 저장
            localStorage.setItem('newsData', JSON.stringify(this.newsData));
            localStorage.setItem('lastNewsUpdate', new Date().toISOString());
            
            this.renderNews();
            this.updateLastUpdatedTime();
            
            console.log('뉴스가 업데이트되었습니다.');
        } catch (error) {
            console.error('뉴스 업데이트 중 오류 발생:', error);
            this.showError('뉴스를 불러오는 중 오류가 발생했습니다.');
        }
    }

    // 캐시된 뉴스 로드
    loadCachedNews() {
        const cachedNews = localStorage.getItem('newsData');
        if (cachedNews) {
            this.newsData = JSON.parse(cachedNews);
            this.filteredNews = [...this.newsData];
            this.renderNews();
            this.updateLastUpdatedTime();
        } else {
            this.updateNews();
        }
    }

    // 뉴스 데이터 가져오기 (실제 API 연동 필요)
    async fetchNewsData() {
        // 실제 환경에서는 여러 언론사의 RSS 피드를 파싱하거나 뉴스 API를 사용
        // 여기서는 샘플 데이터를 생성
        return new Promise((resolve) => {
            setTimeout(() => {
                const sampleNews = this.generateSampleNews();
                resolve(sampleNews);
            }, 1000);
        });
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

        const news = [];
        const today = new Date();
        
        for (let i = 0; i < 15; i++) {
            const randomHour = Math.floor(Math.random() * 12) + 8; // 8시~19시
            const publishTime = new Date(today);
            publishTime.setHours(randomHour, Math.floor(Math.random() * 60));
            
            const category = categories[Math.floor(Math.random() * categories.length)];
            
            news.push({
                id: `news-${Date.now()}-${i}`,
                title: sampleTitles[i % sampleTitles.length] + ` (${i + 1})`,
                description: `${sampleTitles[i % sampleTitles.length]}에 관한 상세한 내용입니다. 경제 전문가들은 이번 발표가 시장에 긍정적인 영향을 미칠 것으로 전망하고 있습니다.`,
                source: sources[Math.floor(Math.random() * sources.length)],
                category: category,
                categoryName: categoryNames[category],
                publishTime: publishTime,
                url: '#'
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
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);

        if (minutes < 60) {
            return `${minutes}분 전`;
        } else if (hours < 24) {
            return `${hours}시간 전`;
        } else {
            return date.toLocaleDateString('ko-KR', {
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
        const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
        
        lastUpdated.textContent = `마지막 업데이트: ${koreaTime.toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }

    // 강제 업데이트 (디버깅 및 수동 실행용)
    forceUpdate() {
        console.log('강제 업데이트 실행');
        // localStorage에서 마지막 업데이트 시간 제거하여 강제 업데이트
        localStorage.removeItem('lastNewsUpdate');
        this.updateNews();
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