CREATE TABLE IF NOT EXISTS share_links (
  token TEXT PRIMARY KEY NOT NULL,
  target_path TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  revoked_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_share_links_expiry ON share_links(expires_at);
