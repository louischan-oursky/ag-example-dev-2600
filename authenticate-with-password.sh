#!/bin/sh

set -eux

curl -s -XPOST \
	-H "Content-Type: application/json" \
	-d "
{
	\"state_token\": \"$STATE_TOKEN\",
	\"input\": {
		\"authentication\": \"primary_password\",
		\"password\": \"$PASSWORD\"
	}
}
	" \
	"$ENDPOINT/api/v1/authentication_flows/states/input"
