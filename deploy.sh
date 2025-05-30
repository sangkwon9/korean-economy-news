#!/bin/bash

# 배포 스크립트
# GitHub Pages에 웹사이트를 배포하는 간단한 스크립트

echo "🚀 GitHub Pages에 한국경제 뉴스 모아보기 웹사이트 배포를 시작합니다..."

# 현재 브랜치 확인
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "📋 현재 브랜치: $current_branch"

# 변경사항 커밋
echo "📝 변경사항 커밋 중..."
git add .
git commit -m "웹사이트 업데이트: $(date +"%Y-%m-%d %H:%M:%S")"

# GitHub에 푸시
echo "📤 GitHub에 푸시 중..."
git push origin $current_branch

# GitHub Pages 브랜치 (gh-pages)가 있는지 확인
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "🔄 gh-pages 브랜치가 존재합니다. 업데이트합니다..."
else
    echo "🔄 gh-pages 브랜치가 없습니다. 새로 생성합니다..."
    git checkout --orphan gh-pages
    git reset --hard
    git commit --allow-empty -m "GitHub Pages 브랜치 초기화"
    git checkout $current_branch
fi

# gh-pages 브랜치에 현재 상태 배포
echo "🔄 gh-pages 브랜치에 현재 상태를 배포합니다..."
git checkout gh-pages

# 모든 파일 복사
git checkout $current_branch -- index.html styles.css script.js README.md LICENSE

# 변경사항 커밋 및 푸시
git add .
git commit -m "배포: $(date +"%Y-%m-%d %H:%M:%S")"
git push origin gh-pages

# 원래 브랜치로 돌아가기
git checkout $current_branch

echo "✅ 배포가 완료되었습니다!"
echo "🌐 웹사이트는 다음 주소에서 확인 가능합니다: https://sangkwon9.github.io/korean-economy-news/" 