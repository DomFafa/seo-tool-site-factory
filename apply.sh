#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="${1:-$(pwd)}"
PATCH_FILE="$SCRIPT_DIR/seo-tool-site-factory-v1.patch"
OVERLAY_DIR="$SCRIPT_DIR/overlay"

cd "$REPO_DIR"

echo "Applying SEO Tool Site Factory V1 patch in: $REPO_DIR"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git apply --check "$PATCH_FILE"; then
    git apply "$PATCH_FILE"
    echo "Patch applied successfully."
  else
    echo "git apply --check failed. This usually means existing files conflict with the additive scaffold."
    echo "You can manually copy the overlay tree instead:"
    echo "  rsync -av '$OVERLAY_DIR/' '$REPO_DIR/'"
    exit 2
  fi
else
  echo "Not inside a git repository. Copying overlay files into $REPO_DIR."
  cp -a "$OVERLAY_DIR/." "$REPO_DIR/"
fi

echo "Next steps:"
echo "  pnpm install"
echo "  pnpm site list"
echo "  pnpm site check typing-speed-test"
echo "  pnpm site dev typing-speed-test"
