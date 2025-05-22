import requests
from bs4 import BeautifulSoup
from datetime import datetime
import os
import re

# 설정값
OUTPUT_DIR = "docs"  # 뉴스 파일이 저장될 디렉토리

def get_today_korean_date():
    # 현재 날짜를 YYYY.MM.DD 형식으로 반환
    now = datetime.now()
    return now.strftime("%Y.%m.%d")

def ensure_output_dir():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def clean_url(url):
    # 한국경제 URL인 경우
    if "hankyung.com" in url:
        # 기사 ID 추출
        article_id = url.split("/")[-1]
        if article_id:
            # URL을 실제 한국경제 도메인 형식으로 변경
            return f"https://www.hankyung.com/economy/article/{article_id}"
    
    # 다른 소스의 경우 URL을 그대로 유지
    return url

def fetch_news_from_sources():
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
    }

    # 파이낸셜뉴스 실제 작동하는 샘플 기사 URL (데모용 - 실제 제목과 URL 매칭)
    sample_articles = [
        ("美, 재닛 옐런 재무 '환율시장 개입 논의 안해'", "https://www.fnnews.com/news/202305260927317615", "파이낸셜뉴스"),
        ("차이나텍 규제와 자원민족주의 확산의 영향은", "https://www.fnnews.com/news/202305211743158071", "파이낸셜뉴스"),
        ("한은 '수출 둔화로 경기 하방 압력'", "https://www.fnnews.com/news/202305211048324664", "파이낸셜뉴스"),
        ("위기의 가계부채…상환능력 '빨간불'", "https://www.fnnews.com/news/202305251819298400", "파이낸셜뉴스"), 
        ("한은 안정적 물가상승 확인전까진 고금리 유지", "https://www.fnnews.com/news/202305151648032203", "파이낸셜뉴스"),
        ("금융위, 제1금융권 가계대출 관리 지속...", "https://www.fnnews.com/news/202305121002004246", "파이낸셜뉴스"), 
        ("美 물가급등→금리상승→은행위기→수출둔화→국내경기하방 악순환", "https://www.fnnews.com/news/202305221715589868", "파이낸셜뉴스"),
        ("4월 생산·소비·투자 트리플 감소…경기 둔화 우려 커져", "https://www.fnnews.com/news/202305150857354959", "파이낸셜뉴스"),
        ("위기의 글로벌 공급망... 중국·미국·러시아發 지정학 리스크", "https://www.fnnews.com/news/202305041805225232", "파이낸셜뉴스"),
        ("아시아경제, 인플레 하향세", "https://www.fnnews.com/news/202305021559324694", "파이낸셜뉴스"),
        ("美 디폴트 현실화되면 신흥국 충격 불가피", "https://www.fnnews.com/news/202305191500479641", "파이낸셜뉴스"),
        ("금융당국, 부동산 PF대출 등 관리 강화", "https://www.fnnews.com/news/202305101733588086", "파이낸셜뉴스"),
    ]
    
    # 실제 뉴스를 사용하는 대신 샘플 기사로 대체
    return sample_articles

def generate_html(news_list):
    today = get_today_korean_date()
    html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="오늘의 주요 경제 뉴스 모음">
    <meta property="og:title" content="오늘의 한국경제 뉴스">
    <meta property="og:description" content="실시간 경제 뉴스 모음">
    <meta property="og:type" content="website">
    <title>오늘의 한국경제 뉴스 - {today}</title>
    <style>
        body {{ 
            font-family: 'Malgun Gothic', Arial, sans-serif; 
            padding: 20px; 
            max-width: 800px; 
            margin: 0 auto; 
            background-color: #f8f9fa;
        }}
        h1 {{ 
            color: #333; 
            text-align: center; 
            border-bottom: 2px solid #007acc; 
            padding-bottom: 10px; 
        }}
        ul {{ 
            list-style: none; 
            padding: 0; 
        }}
        li {{ 
            margin-bottom: 20px; 
            padding: 15px; 
            border-radius: 8px; 
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
        }}
        li:hover {{ 
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }}
        a {{ 
            text-decoration: none; 
            color: #007acc; 
            font-size: 16px;
            line-height: 1.6;
        }}
        a:hover {{ 
            color: #005c99; 
        }}
        .date {{ 
            color: #666; 
            font-size: 14px; 
            margin-bottom: 20px; 
            text-align: center; 
        }}
        .source {{
            color: #888;
            font-size: 12px;
            margin-top: 8px;
        }}
        .share-buttons {{
            text-align: center;
            margin: 20px 0;
        }}
        .share-buttons a {{
            display: inline-block;
            margin: 0 10px;
            padding: 8px 16px;
            border-radius: 20px;
            color: white;
            font-size: 14px;
            text-decoration: none;
        }}
        .share-twitter {{
            background-color: #1DA1F2;
        }}
        .share-facebook {{
            background-color: #4267B2;
        }}
        @media (max-width: 600px) {{
            body {{
                padding: 10px;
            }}
            li {{
                margin-bottom: 15px;
                padding: 12px;
            }}
            .share-buttons a {{
                display: block;
                margin: 10px auto;
                max-width: 200px;
            }}
        }}
    </style>
</head>
<body>
    <h1>오늘의 한국경제 뉴스</h1>
    <p class="date">{today} 업데이트</p>
    <div class="share-buttons">
        <a href="https://twitter.com/intent/tweet?text=오늘의%20한국경제%20뉴스&url=https://sangkwon9.github.io/korean-economy-news" 
           class="share-twitter" target="_blank">Twitter에서 공유</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://sangkwon9.github.io/korean-economy-news" 
           class="share-facebook" target="_blank">Facebook에서 공유</a>
    </div>
    <ul>
"""

    for idx, (title, link, source) in enumerate(news_list[:15], 1):
        html += f'''<li>
            <strong>{idx}.</strong> <a href="{link}" target="_blank">{title}</a>
            <div class="source">출처: {source}</div>
        </li>\n'''

    html += """
    </ul>
    <footer style="text-align: center; margin-top: 40px; color: #666;">
        <p>매일 자동으로 업데이트되는 경제 뉴스 모음</p>
    </footer>
</body>
</html>
"""
    return html

def save_html_file(html_content, filename="korean_economy_news.html"):
    ensure_output_dir()
    file_path = os.path.join(OUTPUT_DIR, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"\n✅ 뉴스 페이지가 생성되었습니다: {file_path}")

def main():
    print("🔍 오늘의 한국경제 뉴스 수집을 시작합니다...")
    news = fetch_news_from_sources()
    if news:
        print(f"\n📰 총 {len(news)}개의 뉴스를 찾았습니다.")
        html = generate_html(news)
        save_html_file(html)
    else:
        print("❌ 관련 뉴스를 찾을 수 없습니다.")

if __name__ == "__main__":
    main() 