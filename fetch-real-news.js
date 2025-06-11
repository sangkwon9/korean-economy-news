const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class RealNewsUpdater {
    constructor() {
        this.newsData = [];
        this.sources = {
            'KBS': {
                url: 'https://news.kbs.co.kr/news/list.do?icd=19588',
                selector: '.headline-list .item',
                titleSelector: '.headline',
                linkSelector: 'a',
                timeSelector: '.date'
            },
            '연합뉴스': {
                url: 'https://www.yna.co.kr/economy',
                selector: '.list-type038 li',
                titleSelector: '.tit',
                linkSelector: 'a',
                timeSelector: '.txt-time'
            },
            '매일경제': {
                url: 'https://www.mk.co.kr/news/economy/',
                selector: '.list_area .news_item',
                titleSelector: '.news_ttl',
                linkSelector: 'a',
                timeSelector: '.date'
            },
            '이데일리': {
                url: 'https://www.edaily.co.kr/news/list/economy',
                selector: '.newslist_item',
                titleSelector: '.newslist_title',
                linkSelector: 'a',
                timeSelector: '.newslist_date'
            },
            'SBS': {
                url: 'https://news.sbs.co.kr/news/economy.do',
                selector: '.w_news_list .item',
                titleSelector: '.tit',
                linkSelector: 'a',
                timeSelector: '.date'
            }
        };
    }

    async fetchNewsFromSource(sourceName, sourceConfig) {
        try {
            console.log(`${sourceName}에서 뉴스를 가져오는 중...`);
            
            const response = await axios.get(sourceConfig.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000
            });

            const $ = cheerio.load(response.data);
            const articles = [];

            $(sourceConfig.selector).slice(0, 5).each((index, element) => {
                try {
                    const titleElement = $(element).find(sourceConfig.titleSelector);
                    const linkElement = $(element).find(sourceConfig.linkSelector);
                    const timeElement = $(element).find(sourceConfig.timeSelector);

                    let title = titleElement.text().trim();
                    let link = linkElement.attr('href');
                    let time = timeElement.text().trim();

                    if (title && link) {
                        // 상대 URL을 절대 URL로 변환
                        if (link.startsWith('/')) {
                            const baseUrl = new URL(sourceConfig.url).origin;
                            link = baseUrl + link;
                        } else if (!link.startsWith('http')) {
                            link = sourceConfig.url + link;
                        }

                        // 카테고리 분류
                        const category = this.categorizeNews(title);
                        
                        articles.push({
                            id: `news-${Date.now()}-${sourceName}-${index}`,
                            title: title,
                            description: `${title}에 관한 상세한 내용입니다. 자세한 내용은 원문 기사를 확인해주세요.`,
                            source: sourceName,
                            category: category.key,
                            categoryName: category.name,
                            publishTime: new Date().toISOString(),
                            url: link
                        });
                    }
                } catch (error) {
                    console.log(`${sourceName} 개별 기사 파싱 오류:`, error.message);
                }
            });

            console.log(`${sourceName}: ${articles.length}개 기사 수집 완료`);
            return articles;

        } catch (error) {
            console.error(`${sourceName} 뉴스 가져오기 실패:`, error.message);
            return [];
        }
    }

    categorizeNews(title) {
        const categories = {
            stock: { name: '주식시장', keywords: ['코스피', '코스닥', '주가', '증시', '상장', '주식', '투자', '펀드'] },
            industry: { name: '산업동향', keywords: ['반도체', '자동차', '바이오', '건설', '제조', '생산', '산업', '기업'] },
            policy: { name: '정책/제도', keywords: ['정부', '정책', '규제', '법안', '제도', '세금', '예산', '국정'] },
            international: { name: '국제경제', keywords: ['미국', '중국', '일본', '유럽', '환율', '무역', '수출', '수입', '글로벌'] }
        };

        for (const [key, category] of Object.entries(categories)) {
            if (category.keywords.some(keyword => title.includes(keyword))) {
                return { key, name: category.name };
            }
        }

        return { key: 'industry', name: '산업동향' }; // 기본 카테고리
    }

    async fetchAllNews() {
        console.log('실제 뉴스 데이터 수집을 시작합니다...');
        
        for (const [sourceName, sourceConfig] of Object.entries(this.sources)) {
            const articles = await this.fetchNewsFromSource(sourceName, sourceConfig);
            this.newsData.push(...articles);
            
            // 각 요청 사이에 딜레이 (서버 부하 방지)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // 시간순 정렬
        this.newsData.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
        
        console.log(`총 ${this.newsData.length}개의 실제 뉴스 기사를 수집했습니다.`);
        return this.newsData;
    }

    async saveToFile() {
        const newsDataJson = {
            lastUpdated: new Date().toISOString(),
            newsCount: this.newsData.length,
            news: this.newsData
        };

        fs.writeFileSync('news-data.json', JSON.stringify(newsDataJson, null, 2), 'utf8');
        console.log('news-data.json 파일이 업데이트되었습니다.');
    }

    async updateNews() {
        try {
            await this.fetchAllNews();
            await this.saveToFile();
            console.log('실제 뉴스 데이터 업데이트 완료!');
        } catch (error) {
            console.error('뉴스 업데이트 중 오류 발생:', error);
        }
    }
}

// 스크립트 실행
if (require.main === module) {
    const updater = new RealNewsUpdater();
    updater.updateNews();
}

module.exports = RealNewsUpdater; 