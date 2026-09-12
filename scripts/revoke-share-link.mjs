#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const token = process.argv[2];
if (!/^[A-Za-z0-9_-]{32,}$/.test(token || "")) {
  console.error("Usage: revoke-share-link.mjs <token>");
  process.exit(1);
}
if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error("CLOUDFLARE_API_TOKEN is required in the environment.");
  process.exit(1);
}
const now = Math.floor(Date.now() / 1000);
const sql = `UPDATE share_links SET revoked_at = ${now} WHERE token = '${token}' AND revoked_at IS NULL;`;
execFileSync("npx", ["wrangler", "d1", "execute", "presentation-share-links", "--remote", "--command", sql], {
  stdio: "inherit",
  env: process.env
});
console.log("Revocation recorded.");
