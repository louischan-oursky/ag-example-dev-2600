#!/bin/sh

set -eux

curl -s -XPOST \
	-H "Content-Type: application/json" \
	-d "
{
	\"state_token\": \"$STATE_TOKEN\",
	\"input\": {
		\"identification\": \"phone\",
		\"login_id\": \"$PHONE_NUMBER\",
		\"bot_protection\": {
			\"type\": \"cloudflare\",
			\"response\": \"$CLOUDFLARE_RESPONSE\"
		}
	}
}
	" \
	"$ENDPOINT/api/v1/authentication_flows/states/input"
