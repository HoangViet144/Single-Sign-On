CREATE TABLE users (
  username VARCHAR(255) PRIMARY KEY,
  password VARCHAR(1000) NOT NULL
);
INSERT INTO users (username, password) VALUES  ('hoangviet', '27249ef084aaa16e9359effbadf0f6cfc1e8bd4d9f5d64d2630d5f71ab13922f6b24397223ed3bb3aee76d16e7fe360275b1e3db977100bad388c2351a0d698c');
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL
);
INSERT INTO roles (username, role) VALUES ('hoangviet', 'admin');
INSERT INTO roles (username, role) VALUES ('hoangviet', 'user');
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  urlorigin VARCHAR(255) NOT NULL,
  sessiontoken VARCHAR(1000) NOT NULL,
  ssotoken VARCHAR(1000) NOT NULL,
  username VARCHAR(255) NOT NULL,
  time TIMESTAMP NOT NULL
);