#!/usr/bin/env bash
# Deploys the static site to S3 + invalidates CloudFront.
# Cache-Control: no-cache asks browsers/CDN to always revalidate with the
# origin before reusing a cached copy, but Cloudflare (sitting in front of
# CloudFront for glitchmobile.net) overrides this with its own ~4h browser
# cache TTL. To guarantee visitors get the latest JS/CSS on every deploy
# regardless of that, index.html is uploaded with a `?v=<commit>` cache-buster
# on the asset URLs so each deploy points at an effectively new URL.
set -euo pipefail

BUCKET="defdo-fire"
DISTRIBUTION_ID="E3AWYGKVMDUQO1"
PROFILE="bitelit"
VERSION="$(git rev-parse --short HEAD)"

TMP_INDEX="$(mktemp)"
trap 'rm -f "$TMP_INDEX"' EXIT
sed -e "s#assets/styles.css#assets/styles.css?v=$VERSION#" \
    -e "s#assets/script.js#assets/script.js?v=$VERSION#" \
    index.html > "$TMP_INDEX"

aws --profile "$PROFILE" s3 cp "$TMP_INDEX" "s3://$BUCKET/index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache, must-revalidate"

aws --profile "$PROFILE" s3 cp assets/styles.css "s3://$BUCKET/assets/styles.css" \
  --content-type "text/css" \
  --cache-control "no-cache, must-revalidate"

aws --profile "$PROFILE" s3 cp assets/script.js "s3://$BUCKET/assets/script.js" \
  --content-type "application/javascript" \
  --cache-control "no-cache, must-revalidate"

aws --profile "$PROFILE" s3 sync assets/img "s3://$BUCKET/assets/img" \
  --cache-control "no-cache, must-revalidate"

aws --profile "$PROFILE" cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/index.html" "/assets/styles.css" "/assets/script.js" "/assets/img/*"

echo "Deployed. Site: https://glitchmobile.net"
