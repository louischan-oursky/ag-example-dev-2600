#!/bin/sh

set -eux

curl -s -XPOST \
	-H "Content-Type: application/json" \
	-d "
{
	\"type\": \"account_recovery\",
	\"name\": \"$FLOW_NAME\"
}
	" \
	"$ENDPOINT/api/v1/authentication_flows"
