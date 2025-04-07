const process = require("node:process");

function getenv(name) {
  const value = process.env[name];
  if (value == null) {
    throw new Error(
      `environment variable ${name} is not set. Please read the guide carefully.`,
    );
  }
  return value;
}

const ENDPOINT = getenv("ENDPOINT");
const CLIENT_ID = getenv("CLIENT_ID");
const REDIRECT_URI = getenv("REDIRECT_URI");
const FINISH_REDIRECT_URI = getenv("FINISH_REDIRECT_URI");
const CODE_VERIFIER = getenv("CODE_VERIFIER");

const OIDC_CONFIGURATION_ENDPOINT = new URL(
  "/.well-known/openid-configuration",
  ENDPOINT,
);

async function main() {
  const resp = await fetch(OIDC_CONFIGURATION_ENDPOINT);
  const configuration = await resp.json();
  const token_endpoint = configuration["token_endpoint"];

  const resp2 = await fetch(FINISH_REDIRECT_URI, {
    redirect: "manual",
  });

  const body = await resp2.text();
  const match = /code=([a-zA-Z0-9]+)/.exec(body);
  const authorization_code = match[1];

  const token_request = new URLSearchParams();
  token_request.set("grant_type", "authorization_code");
  token_request.set("code", authorization_code);
  token_request.set("client_id", CLIENT_ID);
  token_request.set("redirect_uri", REDIRECT_URI);
  token_request.set("code_verifier", CODE_VERIFIER);

  const resp3 = await fetch(token_endpoint, {
    method: "POST",
    // If body is URLSearchParams, then the Content-Type is application/x-www-form-urlencoded.
    // In your implementation, you need POST form data (application/x-www-form-urlencoded) to the token endpoint.
    body: token_request,
  });
  const token_response = await resp3.json();
  console.log(JSON.stringify(token_response, null, 2));
}

main();
