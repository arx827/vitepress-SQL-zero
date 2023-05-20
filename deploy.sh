#!/usr/bin/env sh

# 忽略錯誤
set -e

# 生成靜態文件
npm run docs:build

# 進入生成的文件夾
cd docs/.vitepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果發佈到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/arx827/vitepress-SQL-zero.git master:gh-pages

cd -