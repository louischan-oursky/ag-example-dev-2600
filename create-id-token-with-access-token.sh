#!/bin/sh

set -eux

curl -s -XPOST \
	-H "Content-Type: application/json" \
	-d "
{
	\"access_token\": \"$ACCESS_TOKEN\"
}
	" \
	"$MIDDLEWARE_ENDPOINT/id_token"
