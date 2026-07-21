#!/usr/bin/env bash
# Deploys the static site to S3 + invalidates CloudFront.
# Cache-Control: no-cache forces browsers/CDN to always revalidate with the
# origin (via ETag) before reusing a cached copy, since files aren't
# fingerprinted with a hash in their name.
set -euo pipefail

BUCKET="defdo-fire"
DISTRIBUTION_ID="E3AWYGKVMDUQO1"
PROFILE="bitelit"

aws --profile "$PROFILE" s3 cp index.html "s3://$BUCKET/index.html" \
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

echo "Deployed. Site: https://fire.defdo.ninja"
