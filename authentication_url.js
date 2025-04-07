const { Buffer } = require("node:buffer");
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

const OIDC_CONFIGURATION_ENDPOINT = new URL(
  "/.well-known/openid-configuration",
  ENDPOINT,
);

function base64url(array) {
  const buffer = Buffer.from(array);
  return buffer.toString("base64url");
}

function generate_code_verifier() {
  // https://datatracker.ietf.org/doc/html/rfc7636#appendix-B
  // > The client uses output of a suitable random number generator to
  // >  create a 32-octet sequence.
  const randomBytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(randomBytes);
  return base64url(randomBytes);
}

async function generate_code_challenge_with_S256(str) {
  const textEncoder = new TextEncoder();
  const bytes = textEncoder.encode(str);
  const arrayBuffer = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  const result = base64url(arrayBuffer);
  return result;
}

async function main() {
  const resp = await fetch(OIDC_CONFIGURATION_ENDPOINT);
  const configuration = await resp.json();
  const authorization_endpoint = configuration["authorization_endpoint"];

  const code_verifier = generate_code_verifier();
  const code_challenge = await generate_code_challenge_with_S256(code_verifier);

  const params = new URLSearchParams();
  params.set("response_type", "code");
  params.set("code_challenge_method", "S256");
  params.set("code_challenge", code_challenge);
  params.set(
    "scope",
    [
      "openid",
      "offline_access",
      "https://authgear.com/scopes/full-access",
    ].join(" "),
  );
  params.set("client_id", CLIENT_ID);
  params.set("redirect_uri", REDIRECT_URI);
  params.set("x_suppress_idp_session_cookie", "true");
  params.set("x_sso_enabled", "false");

  const authentication_url = new URL(authorization_endpoint);
  authentication_url.search = "?" + params.toString();

  const resp2 = await fetch(authentication_url, {
    redirect: "manual",
  });

  console.log(`export CODE_VERIFIER="${code_verifier}"`);
  const location = new URL(resp2.headers.get("Location"));
  console.log(`export QUERY="${location.search.slice(1)}"`);
}

main();
