#!/bin/bash

# 한국 HR 뉴스 웹사이트 배포 스크립트

echo "🏢 한국 HR 뉴스 웹사이트 배포 시작..."

# 변경사항 확인
echo "📋 변경사항 확인 중..."
git status

# 모든 변경사항 추가
echo "📦 변경사항 추가 중..."
git add .

# 커밋 메시지 입력받기
echo "💬 커밋 메시지를 입력하세요:"
read commit_message

# 커밋 실행
if [ -z "$commit_message" ]; then
    commit_message="HR 뉴스 웹사이트 업데이트"
fi

echo "✅ 커밋 실행: $commit_message"
git commit -m "$commit_message"

# GitHub에 푸시
echo "🚀 GitHub에 배포 중..."
git push origin main

echo "✨ 배포 완료!"
echo "🌐 웹사이트: https://sangkwon9.github.io/korean-hr-news/"
echo "⏰ GitHub Pages 반영까지 2-3분 소요될 수 있습니다." 