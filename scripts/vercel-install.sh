#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/oasi-phuoc/doc-prof.git"
LFS_URL="${REPO_URL}/info/lfs"

git lfs install
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$REPO_URL"
fi
git remote set-url origin "$REPO_URL"
git config lfs.url "$LFS_URL"
git lfs pull || true
npm install
