const DOMAIN = "https://nihaopaul.cloudflareaccess.com";
const CERT_URL = `${DOMAIN}/cdn-cgi/access/certs`;
const AUD = [
  "006fb25724bb43a85ba83fa0b6c0c5958e640b626be78d87dd0b8787a07d2f00",
  "a4bef775641c84a21da521341689c62f384aa6fb8e4a1dcc2ffffd3439daa83d",
  "00e576496044ad490d0794329efc41931d3658e76e07fdab2a166085f34220f4",
  "bf097ff34ef52cf135a8cc1863c94776644c20e13c3e6df463f64618306f8262",
  "e64a81269f1271fa64b9e92ed145062f91e3f7a1ca76d8897c0699e0b4879f4f"
];


module.exports = { DOMAIN, CERT_URL, AUD }
