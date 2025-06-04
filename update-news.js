const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const moment = require('moment-timezone');
const fs = require('fs').promises;

// RSS 피드 URL들 - 한국 주요 경제 언론사
const RSS_FEEDS = [
    {
        name: '한국경제',
        url: 'https://rss.hankyung.com/economy.xml',
        source: '한국경제'
    },
    {
        name: '매일경제',
        url: 'https://www.mk.co.kr/rss/30000001/',
        source: '매일경제'
    },
    {
        name: '연합뉴스 경제',
        url: 'https://www.yonhapnews.co.kr/rss/economy.xml',
        source: '연합뉴스'
    },
    {
        name: '서울경제',
        url: 'https://www.sedaily.com/NewsList/02/RSSNewsList_02.xml',
        source: '서울경제'
    },
    {
        name: '이데일리',
        url: 'https://rss.edaily.co.kr/economy.xml',
        source: '이데일리'
    }
];

// 한국경제 관련 키워드 (인기도 판단용)
const ECONOMY_KEYWORDS = [
    '코스피', '코스닥', '주식', '증시', '환율', '달러', '원화',
    '금리', '한국은행', '기준금리', '물가', '인플레이션',
    '수출', '수입', '무역', '경상수지', 'GDP', '성장률',
    '반도체', '자동차', '조선', '철강', '화학', '바이오',
    '부동산', '아파트', '집값', '전세', '임대료',
    '취업', '실업률', '고용', '일자리', '최저임금',
    '기업', '대기업', '중소기업', '스타트업', '벤처',
    '투자', '펀드', '채권', '증권', '금융',
    '정부', '정책', '예산', '세금', '법인세'
];

// 카테고리 분류 함수
function categorizeNews(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    
    if (text.includes('코스피') || text.includes('코스닥') || text.includes('주식') || text.includes('증시')) {
        return 'stock';
    }
    if (text.includes('반도체') || text.includes('자동차') || text.includes('조선') || text.includes('철강')) {
        return 'industry';
    }
    if (text.includes('정부') || text.includes('정책') || text.includes('한국은행') || text.includes('기준금리')) {
        return 'policy';
    }
    if (text.includes('달러') || text.includes('환율') || text.includes('무역') || text.includes('수출')) {
        return 'international';
    }
    
    return 'stock'; // 기본값
}

// 인기도 점수 계산 함수
function calculatePopularity(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    let score = 50; // 기본 점수
    
    // 키워드 매칭으로 인기도 증가
    ECONOMY_KEYWORDS.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
            score += 10;
        }
    });
    
    // 긴급/속보 등의 단어가 있으면 점수 추가
    if (text.includes('속보') || text.includes('긴급')) score += 20;
    if (text.includes('폭등') || text.includes('폭락')) score += 15;
    if (text.includes('사상') || text.includes('최고') || text.includes('최저')) score += 15;
    
    return Math.min(score, 100); // 최대 100점
}

// RSS 피드에서 뉴스 가져오기
async function fetchNewsFromRSS(feed) {
    try {
        console.log(`📰 ${feed.name}에서 뉴스를 가져오는 중...`);
        
        const response = await axios.get(feed.url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const parser = new xml2js.Parser({
            explicitArray: false,
            ignoreAttrs: false
        });
        
        const result = await parser.parseStringPromise(response.data);
        const items = result.rss?.channel?.item || result.feed?.entry || [];
        
        if (!Array.isArray(items)) {
            return [items].filter(Boolean);
        }
        
        return items.slice(0, 20); // 최대 20개 아이템만 가져오기
        
    } catch (error) {
        console.error(`❌ ${feed.name} RSS 피드 오류:`, error.message);
        return [];
    }
}

// 뉴스 데이터 정규화
function normalizeNewsData(items, source) {
    return items.map((item, index) => {
        const title = item.title || item.title?._ || '';
        const description = item.description || item.summary || item.content || '';
        const link = item.link || item.link?.href || item.guid || '';
        const pubDate = item.pubDate || item.published || item['dc:date'] || new Date().toISOString();
        
        // HTML 태그 제거
        const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
        const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
        
        // 한국 시간으로 날짜 포맷
        const koreanDate = moment(pubDate).tz('Asia/Seoul').format('YYYY.MM.DD');
        
        return {
            id: Date.now() + index,
            title: cleanTitle,
            summary: cleanDescription.substring(0, 150) + (cleanDescription.length > 150 ? '...' : ''),
            url: link,
            source: source,
            category: categorizeNews(cleanTitle, cleanDescription),
            date: koreanDate,
            popularity: calculatePopularity(cleanTitle, cleanDescription),
            fetchTime: new Date().toISOString()
        };
    }).filter(news => news.title && news.title.length > 0);
}

// 메인 뉴스 업데이트 함수
async function updateNews() {
    console.log('🚀 한국경제 뉴스 업데이트 시작...');
    console.log('⏰ 현재 시간 (한국):', moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'));
    
    let allNews = [];
    
    // 모든 RSS 피드에서 뉴스 수집
    for (const feed of RSS_FEEDS) {
        const items = await fetchNewsFromRSS(feed);
        const normalizedNews = normalizeNewsData(items, feed.source);
        allNews = allNews.concat(normalizedNews);
        
        console.log(`✅ ${feed.name}: ${normalizedNews.length}개 뉴스 수집`);
        
        // API 요청 제한을 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 중복 제거 (제목 기준)
    const uniqueNews = [];
    const seenTitles = new Set();
    
    for (const news of allNews) {
        if (!seenTitles.has(news.title)) {
            seenTitles.add(news.title);
            uniqueNews.push(news);
        }
    }
    
    // 인기도 순으로 정렬하고 상위 20개만 선택
    const topNews = uniqueNews
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20);
    
    // 뉴스 데이터 파일 업데이트
    const newsData = {
        lastUpdated: moment().tz('Asia/Seoul').toISOString(),
        updateTime: moment().tz('Asia/Seoul').format('YYYY년 MM월 DD일 HH:mm'),
        totalCollected: allNews.length,
        uniqueNews: uniqueNews.length,
        topNewsCount: topNews.length,
        news: topNews
    };
    
    try {
        await fs.writeFile('news-data.json', JSON.stringify(newsData, null, 2), 'utf8');
        console.log(`✅ 뉴스 데이터 업데이트 완료!`);
        console.log(`📊 통계: 총 ${allNews.length}개 수집 → 중복제거 ${uniqueNews.length}개 → 상위 ${topNews.length}개 선정`);
        
        // 카테고리별 분포 출력
        const categoryCount = {};
        topNews.forEach(news => {
            categoryCount[news.category] = (categoryCount[news.category] || 0) + 1;
        });
        console.log('📈 카테고리별 분포:', categoryCount);
        
    } catch (error) {
        console.error('❌ 파일 저장 오류:', error);
    }
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
    updateNews().catch(console.error);
}

module.exports = { updateNews }; 