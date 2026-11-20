CREATE TABLE users (
 id TEXT PRIMARY KEY, given_name TEXT NOT NULL, family_name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL,
 domains TEXT NOT NULL DEFAULT '["algèbre","géométrie","alphabetisation"]',
 account TEXT NOT NULL DEFAULT 'partial' CHECK (account IN ('partial','full','admin')),
 verified_at TEXT, created_at TEXT NOT NULL,
 failed_logins INTEGER NOT NULL DEFAULT 0, locked_until INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE email_verifications (
 token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL
);
CREATE TABLE user_sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL
);
CREATE INDEX user_sessions_user ON user_sessions(user_id);
ALTER TABLE fiches ADD COLUMN owner_id TEXT REFERENCES users(id);
CREATE INDEX fiches_owner_updated ON fiches(owner_id, updated_at DESC);
