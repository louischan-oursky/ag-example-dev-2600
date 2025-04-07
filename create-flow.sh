#!/bin/sh

set -eux

curl -s -XPOST \
	-H "Content-Type: application/json" \
	-d "
{
	\"type\": \"signup_login\",
	\"name\": \"$FLOW_NAME\"
}
	" \
	"$ENDPOINT/api/v1/authentication_flows?$QUERY"
