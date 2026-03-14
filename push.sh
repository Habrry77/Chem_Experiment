#!/bin/bash
# Git 一键推送脚本（适配无关历史场景）

# 1. 处理远程仓库已存在的问题（替换原 add 命令）
git remote set-url origin https://github.com/Habrry77/Chem_Experiment.git

# 2. 拉取远程代码并允许合并无关历史
git pull origin master --allow-unrelated-histories

# 3. 添加所有变更到暂存区
git add .

# 4. 提交变更（如果有内容可提交）
git commit -m "Merge remote changes" || echo "No changes to commit"

# 5. 推送到远程仓库
git push origin master