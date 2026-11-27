#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# point the site at YOUR neocities username
#
#   ./deploy/set-sitename.sh yourusername
#
# rewrites every "monsoon.neocities.org" (buttons, canonical URLs, sitemap,
# robots.txt, share links) to "yourusername.neocities.org".
# safe to run repeatedly: it always swaps whatever the current name is,
# tracked in site/.sitename
# ---------------------------------------------------------------------------
set -euo pipefail
NEW="${1:-}"
[ -z "$NEW" ] && { echo "usage: ./deploy/set-sitename.sh <neocities-username>" >&2; exit 2; }

SITE="$(cd "$(dirname "${BASH_SOURCE[0]}")/../site" && pwd)"
OLD="monsoon"
[ -f "$SITE/.sitename" ] && OLD="$(cat "$SITE/.sitename")"

if [ "$OLD" = "$NEW" ]; then echo "already set to $NEW"; exit 0; fi

grep -rl "${OLD}.neocities.org" "$SITE" --include='*.html' --include='*.xml' --include='*.txt' \
  | while read -r f; do
      sed -i "s/${OLD}\.neocities\.org/${NEW}.neocities.org/g" "$f"
      echo "  updated ${f#$SITE/}"
    done

printf '%s' "$NEW" > "$SITE/.sitename"
echo "==> done. every link now points at https://${NEW}.neocities.org/"
echo "    next: NEOCITIES_API_KEY=... ./deploy/deploy.sh"
