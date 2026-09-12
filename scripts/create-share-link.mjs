#!/usr/bin/env node
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const get = (name) => args[args.indexOf(name) + 1];
const target = get("--target");
const days = Number(get("--days") || 30);

if (!target || !/^\/private\/[a-z0-9][a-z0-9-]*\/$/.test(target) || !Number.isFinite(days) || days <= 0 || days > 365) {
  console.error("Usage: create-share-link.mjs --target /private/<presentation-slug>/ [--days 30]");
  process.exit(1);
}
if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error("CLOUDFLARE_API_TOKEN is required in the environment.");
  process.exit(1);
}

const token = randomBytes(32).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const expiry = now + Math.round(days * 86400);
const sql = `INSERT INTO share_links (token, target_path, expires_at, created_at) VALUES ('${token}', '${target}', ${expiry}, ${now});`;

execFileSync("npx", ["wrangler", "d1", "execute", "presentation-share-links", "--remote", "--command", sql], {
  stdio: "ignore",
  env: process.env
});

console.log(`https://presentation.can-design.workers.dev/s/${token}/`);
console.log(`Expires: ${new Date(expiry * 1000).toISOString()}`);
