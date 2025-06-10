const fs = require('fs');
const path = require('path');

// RSS 피드 URL들
const RSS_FEEDS = {
    '연합뉴스': {
        url: 'https://www.yonhapnews.co.kr/rss/economy.xml',
        category: 'industry'
    },
    '매일경제': {
        url: 'https://www.mk.co.kr/rss/30000001/',
        category: 'stock'
    },
    '한국경제': {
        url: 'https://www.hankyung.com/feed/economy',
        category: 'industry'
    },
    '이데일리': {
        url: 'https://www.edaily.co.kr/rss/edaily_news.xml',
        category: 'stock'
    }
};

// 카테고리 매핑
const CATEGORY_MAPPING = {
    '주식': 'stock',
    '증권': 'stock',
    '코스피': 'stock',
    '코스닥': 'stock',
    '산업': 'industry',
    '기업': 'industry',
    '정책': 'policy',
    '정부': 'policy',
    '국제': 'international',
    '미국': 'international',
    '중국': 'international',
    '일본': 'international'
};

// 뉴스 데이터 수집 함수
async function fetchNewsData() {
    const allNews = [];
    
    try {
        // 실제 환경에서는 RSS 파서를 사용하여 뉴스 데이터 수집
        // 여기서는 샘플 데이터로 대체
        const sampleNews = generateDailyNews();
        allNews.push(...sampleNews);
        
        // 시간순 정렬
        allNews.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
        
        // 최대 20개 뉴스만 선택
        const topNews = allNews.slice(0, 20);
        
        // JSON 파일로 저장
        const outputPath = path.join(__dirname, 'news-data.json');
        fs.writeFileSync(outputPath, JSON.stringify({
            lastUpdated: new Date().toISOString(),
            newsCount: topNews.length,
            news: topNews
        }, null, 2));
        
        console.log(`✅ ${topNews.length}개의 뉴스를 성공적으로 수집했습니다.`);
        console.log(`📁 저장 경로: ${outputPath}`);
        
        return topNews;
        
    } catch (error) {
        console.error('❌ 뉴스 수집 중 오류 발생:', error);
        throw error;
    }
}

// 매일 새로운 샘플 뉴스 생성
function generateDailyNews() {
    const sources = ['연합뉴스', '매일경제', '한국경제', '이데일리', 'KBS', 'SBS', '서울경제', '머니투데이'];
    const categories = ['stock', 'industry', 'policy', 'international'];
    const categoryNames = {
        'stock': '주식시장',
        'industry': '산업동향', 
        'policy': '정책/제도',
        'international': '국제경제'
    };

    // 매일 다른 뉴스 제목을 위한 시드 생성
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    const newsTitles = [
        `코스피 ${getRandomValue(['상승', '하락', '횡보'], seed)}세 지속, 외국인 ${getRandomValue(['순매수', '순매도'], seed)} ${getRandomValue(['확대', '지속'], seed)}`,
        `${getRandomValue(['반도체', 'IT', '자동차', '조선'], seed)} 업계 실적 ${getRandomValue(['개선', '부진'], seed)} 전망`,
        `정부, ${getRandomValue(['중소기업', '스타트업', '제조업'], seed)} 지원 정책 발표`,
        `미국 연준 기준금리 ${getRandomValue(['인상', '동결', '인하'], seed)} 결정`,
        `${getRandomValue(['자동차', '반도체', '배터리'], seed)} 업계 ${getRandomValue(['전기차', '신기술', 'AI'], seed)} 투자 확대`,
        `부동산 시장 ${getRandomValue(['안정화', '활성화'], seed)} 조치 시행`,
        `원달러 환율 ${getRandomValue(['상승', '하락'], seed)}세 지속, ${getRandomValue(['1,200', '1,300', '1,400'], seed)}원대`,
        `국내 주요 기업 ${getRandomValue(['3분기', '4분기'], seed)} 실적 발표 예정`,
        `글로벌 ${getRandomValue(['인플레이션', '경기침체'], seed)} 우려 ${getRandomValue(['지속', '완화'], seed)}`,
        `스타트업 투자 유치 ${getRandomValue(['증가', '감소'], seed)}세, ${getRandomValue(['AI', '바이오', '핀테크'], seed)} 분야 주목`,
        `${getRandomValue(['삼성', 'LG', 'SK'], seed)}그룹, ${getRandomValue(['해외', '국내'], seed)} 투자 ${getRandomValue(['확대', '재검토'], seed)}`,
        `${getRandomValue(['수출', '수입'], seed)} ${getRandomValue(['증가', '감소'], seed)}, ${getRandomValue(['중국', '미국', '일본'], seed)}과의 교역 ${getRandomValue(['확대', '축소'], seed)}`,
        `국내 ${getRandomValue(['GDP', '물가상승률'], seed)} ${getRandomValue(['상승', '하락'], seed)}, 경제성장률 전망 ${getRandomValue(['상향', '하향'], seed)} 조정`,
        `${getRandomValue(['은행', '증권', '보험'], seed)}업계 ${getRandomValue(['디지털', 'ESG'], seed)} 전환 가속화`,
        `${getRandomValue(['석유', '가스', '전력'], seed)} 가격 ${getRandomValue(['상승', '하락'], seed)}, 에너지 정책 ${getRandomValue(['재검토', '강화'], seed)}`
    ];

    const news = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
        // 오늘 오전 8시부터 오후 6시까지의 랜덤 시간
        const randomHour = Math.floor(Math.random() * 10) + 8; // 8시~17시
        const randomMinute = Math.floor(Math.random() * 60);
        const publishTime = new Date(now);
        publishTime.setHours(randomHour, randomMinute, 0, 0);
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const title = newsTitles[i % newsTitles.length];
        
        news.push({
            id: `news-${today.getTime()}-${i}`,
            title: title,
            description: `${title}에 관한 상세한 내용입니다. 경제 전문가들은 이번 발표가 시장에 ${getRandomValue(['긍정적인', '부정적인', '중립적인'], seed + i)} 영향을 미칠 것으로 전망하고 있습니다. ${getRandomValue(['투자자들의 관심이 집중되고 있습니다.', '시장 반응을 주목해야 할 것으로 보입니다.', '향후 정책 방향에 대한 논의가 예상됩니다.'], seed + i)}`,
            source: sources[Math.floor(Math.random() * sources.length)],
            category: category,
            categoryName: categoryNames[category],
            publishTime: publishTime.toISOString(),
            url: `https://example.com/news/${i + 1}` // 실제로는 각 뉴스의 실제 URL
        });
    }

    return news;
}

// 시드를 기반으로 일관된 랜덤 값 생성
function getRandomValue(array, seed) {
    const index = seed % array.length;
    return array[index];
}

// 실제 RSS 피드 파싱 함수 (구현 예시)
async function parseRSSFeed(url) {
    // 실제 구현에서는 xml2js 또는 rss-parser 라이브러리 사용
    // const Parser = require('rss-parser');
    // const parser = new Parser();
    // const feed = await parser.parseURL(url);
    // return feed.items;
    
    console.log(`RSS 피드 파싱: ${url}`);
    return [];
}

// 스크립트 실행
if (require.main === module) {
    fetchNewsData()
        .then(() => {
            console.log('✅ 뉴스 데이터 수집 완료');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ 뉴스 데이터 수집 실패:', error);
            process.exit(1);
        });
}

module.exports = { fetchNewsData, generateDailyNews }; 