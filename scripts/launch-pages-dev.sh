#!/usr/bin/env bash
set -euo pipefail

SITES=(
  typing-speed-test
  convertir-imagen-a-png
  cursive-generator
  cursed-text-generator
  anagram-solver
  cursive-alphabet
  typing-practice
  typing-practice-paragraph
  typing-test-online
  correcteur-orthographe
)

COMMAND="${1:-help}"

usage() {
  cat <<'EOF'
Usage:
  bash scripts/launch-pages-dev.sh check
  bash scripts/launch-pages-dev.sh build
  bash scripts/launch-pages-dev.sh create-projects
  bash scripts/launch-pages-dev.sh deploy
  bash scripts/launch-pages-dev.sh verify
  bash scripts/launch-pages-dev.sh all
EOF
}

check_sites() {
  pnpm site check --all
}

build_sites() {
  for site in "${SITES[@]}"; do
    echo "\n==> Building ${site}"
    pnpm site build "${site}"
  done
  pnpm ops report
}

create_projects() {
  for site in "${SITES[@]}"; do
    project="seo-tool-${site}"
    echo "\n==> Creating Cloudflare Pages project ${project}"
    pnpm exec wrangler pages project create "${project}" --production-branch main || true
  done
}

deploy_sites() {
  for site in "${SITES[@]}"; do
    echo "\n==> Deploying ${site}"
    pnpm site deploy "${site}" --production
  done
}

verify_sites() {
  for site in "${SITES[@]}"; do
    echo "\n==> Verifying ${site}"
    pnpm site verify "${site}" || true
  done
  pnpm ops report
}

case "${COMMAND}" in
  check) check_sites ;;
  build) check_sites; build_sites ;;
  create-projects) create_projects ;;
  deploy) check_sites; deploy_sites ;;
  verify) verify_sites ;;
  all) check_sites; build_sites; create_projects; deploy_sites; verify_sites ;;
  *) usage; exit 1 ;;
esac
