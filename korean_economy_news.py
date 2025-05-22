import requests
from bs4 import BeautifulSoup
from datetime import datetime
import os
import re

# 설정값
OUTPUT_DIR = "news_output"  # 뉴스 파일이 저장될 디렉토리

def get_today_korean_date():
    return datetime.now().strftime("%Y.%m.%d")

def ensure_output_dir():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def clean_url(url):
    # URL에서 기본 도메인과 기사 ID만 추출
    if "hankyung.com" in url:
        # 기사 ID 추출 (숫자와 알파벳으로 구성된 마지막 부분)
        article_id = re.search(r'[0-9a-zA-Z]+$', url)
        if article_id:
            return f"https://www.hankyung.com/news/{article_id.group()}"
    return url

def fetch_news_from_sources():
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
    }

    sources = [
        {
            "name": "한국경제",
            "url": "https://www.hankyung.com/economy",
            "selector": "h2.news-tit a, h3.news-tit a"
        },
        {
            "name": "매일경제",
            "url": "https://www.mk.co.kr/news/economy/",
            "selector": ".subject a"
        }
    ]
    
    news_list = []
    
    for source in sources:
        try:
            print(f"\n🔍 {source['name']} 뉴스 수집 중...")
            response = requests.get(source["url"], headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "html.parser")
            news_items = soup.select(source["selector"])
            print(f"Found {len(news_items)} news items from {source['name']}")

            for item in news_items:
                if source["name"] == "한국경제":
                    title = item.text.strip()
                    link = clean_url(item["href"])
                else:
                    title = item.text.strip()
                    link_tag = item.find_parent("a")
                    if not link_tag:
                        continue
                    link = clean_url(link_tag["href"])

                print(f"Processing: {title}")
                if any(keyword in title for keyword in ["경제", "환율", "금리", "수출", "무역", "부동산", "물가", "증시", "주가", "GDP", "성장률"]):
                    news_list.append((title, link))
                    print(f"✓ Added news: {title}")

        except requests.Timeout:
            print(f"⚠️ {source['name']} 접속 시간 초과")
            continue
        except requests.RequestException as e:
            print(f"⚠️ {source['name']} 접속 오류: {e}")
            continue
        except Exception as e:
            print(f"⚠️ {source['name']} 처리 중 오류 발생: {e}")
            continue

    return news_list

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
        <a href="https://twitter.com/intent/tweet?text=오늘의%20한국경제%20뉴스&url=https://korean-economy-news.netlify.app" 
           class="share-twitter" target="_blank">Twitter에서 공유</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://korean-economy-news.netlify.app" 
           class="share-facebook" target="_blank">Facebook에서 공유</a>
    </div>
    <ul>
"""

    for idx, (title, link) in enumerate(news_list[:15], 1):
        html += f'''<li>
            <strong>{idx}.</strong> <a href="{link}" target="_blank">{title}</a>
            <div class="source">출처: 한국경제</div>
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