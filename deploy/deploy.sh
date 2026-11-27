#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# monsoon.exe — publish the site/ folder to Neocities
#
# 1. make a Neocities account, note your username (it becomes
#    https://USERNAME.neocities.org)
# 2. https://neocities.org/settings  ->  choose your site  ->  API key  ->  create
# 3. run:
#       NEOCITIES_API_KEY=xxxxxxxxxxxx ./deploy/deploy.sh
#    (or: ./deploy/deploy.sh --api-key xxxxxxxx)
#
# this script only touches Neocities' own API, uploads only changed files,
# and prints the live URL at the end. pass --dry-run to see what it would do.
# ---------------------------------------------------------------------------
set -euo pipefail

API="${NEOCITIES_API:-https://neocities.org/api}"
SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../site" && pwd)"
DRY_RUN=0
PRUNE=0
API_KEY="${NEOCITIES_API_KEY:-}"

while [ $# -gt 0 ]; do
  case "$1" in
    --api-key) API_KEY="${2:-}"; shift 2 ;;
    --api-key=*) API_KEY="${1#*=}"; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --prune) PRUNE=1; shift ;;
    -h|--help) sed -n '2,20p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

if [ -z "$API_KEY" ]; then
  echo "error: no API key." >&2
  echo "  create one at https://neocities.org/settings (choose your site -> API key)" >&2
  echo "  then: NEOCITIES_API_KEY=xxxx ./deploy/deploy.sh" >&2
  exit 1
fi
if ! command -v curl >/dev/null; then echo "error: curl is required" >&2; exit 1; fi

AUTH="Authorization: Bearer $API_KEY"

echo "==> checking credentials"
INFO="$(curl -sS -f -H "$AUTH" "$API/info" || true)"
if ! printf '%s' "$INFO" | grep -q '"result":"success"'; then
  echo "error: Neocities rejected that API key." >&2
  printf '%s\n' "$INFO" | head -c 400 >&2; echo >&2
  exit 1
fi
SITENAME="$(printf '%s' "$INFO" | sed -n 's/.*"sitename":"\([^"]*\)".*/\1/p')"
URL="${NEOCITIES_SITE_URL:-https://${SITENAME}.neocities.org/}"
echo "    site: $SITENAME  ($URL)"

echo "==> listing remote files"
TMPSHAS="$(mktemp)"; trap 'rm -f "$TMPSHAS"' EXIT
curl -sS -f -H "$AUTH" "$API/list" \
  | tr '{' '\n' \
  | grep -o '"path":"[^"]*"[^}]*"sha1_hash":"[^"]*"' \
  | sed -E 's/.*"path":"([^"]*)".*"sha1_hash":"([^"]*)".*/\2  \1/' > "$TMPSHAS" || true
echo "    $(wc -l < "$TMPSHAS" | tr -d ' ') files on the server"

# files we never want to upload, even if they are lying around
EXCLUDES='\.DS_Store$|/Thumbs\.db$|\.zip$|/\.git/'

echo "==> comparing"
UPLOADS=()
while IFS= read -r -d '' file; do
  rel="${file#"$SITE_DIR"/}"
  printf '%s' "$rel" | grep -Eq "$EXCLUDES" && continue
  local_sha="$(sha1sum "$file" | cut -d' ' -f1)"
  remote_sha="$(grep -F "  $rel" "$TMPSHAS" | head -1 | cut -d' ' -f1 || true)"
  if [ "$local_sha" = "$remote_sha" ]; then
    echo "    EXISTS   $rel"
  else
    echo "    UPLOAD   $rel"
    UPLOADS+=("$rel")
  fi
done < <(find "$SITE_DIR" -type f -print0 | sort -z)

if [ "${#UPLOADS[@]}" -eq 0 ]; then
  echo "==> everything is already up to date. nothing to do."
  echo "    $URL"
  exit 0
fi

if [ "$DRY_RUN" -eq 1 ]; then
  echo "==> dry run: ${#UPLOADS[@]} file(s) would be uploaded. nothing changed."
  exit 0
fi

# Neocities asks for restraint: don't hammer it, batch in small groups.
echo "==> uploading ${#UPLOADS[@]} file(s) to $URL"
CHUNK=4
i=0
while [ "$i" -lt "${#UPLOADS[@]}" ]; do
  args=()
  for rel in "${UPLOADS[@]:$i:$CHUNK}"; do
    args+=(-F "${rel}=@${SITE_DIR}/${rel}")
  done
  RES="$(curl -sS -H "$AUTH" "${args[@]}" "$API/upload" || true)"
  if ! printf '%s' "$RES" | grep -q '"result":"success"'; then
    echo "    FAILED batch starting at ${UPLOADS[$i]}" >&2
    printf '%s\n' "$RES" | head -c 500 >&2; echo >&2
    exit 1
  fi
  echo "    ok: ${UPLOADS[$i]} …"
  i=$((i + CHUNK))
  sleep 2   # be a good neighbour
done

if [ "$PRUNE" -eq 1 ]; then
  echo "==> pruning files that no longer exist locally"
  while read -r _sha path; do
    [ -z "${path:-}" ] && continue
    [ -f "$SITE_DIR/$path" ] && continue
    echo "    DELETE   $path"
    curl -sS -H "$AUTH" -d "filenames[]=$path" "$API/delete" >/dev/null || true
    sleep 1
  done < "$TMPSHAS"
fi

echo
echo "==> done. live at: $URL"
echo "    (open it on your phone, then send it to one friend.)"
