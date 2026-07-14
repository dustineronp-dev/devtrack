# DevTrack — Build Log

A running journal of how this project was built: what was learned, what was 
decided, and why. Written as I go, for my own review and for anyone curious 
about the process behind the finished product.

---

## Day 1 — Docker Fundamentals & Project Setup
- Learned Docker core concepts: images, containers, Dockerfiles
- Installed Docker Desktop + WSL2 on Windows
- Built a basic Express server (routes, callbacks)
- Wrote first Dockerfile (FROM, WORKDIR, COPY, RUN, EXPOSE, CMD)
- Learned Docker build caching (why dependency files are copied before app code)
- Set up Git + GitHub with proper .gitignore

## Day 2 — PostgreSQL & Docker Compose
- Designed database schema: `users` and `job_applications` tables
- Learned PRIMARY KEY vs UNIQUE, NOT NULL, DEFAULT, ENUM types, foreign keys
- Learned password hashing concept (one-way hash, compare not decrypt)
- Learned YAML syntax vs JSON
- Built docker-compose.yml connecting backend + Postgres
- Learned .env / .env.example pattern for secrets management
- Learned Docker networking: service names vs localhost
- Learned volumes for file access between host and container
- Auto-created schema via Postgres init script, verified via psql

## Day 3 — Connecting Express to PostgreSQL
- Installed pg (node-postgres) library
- Learned Promises and async/await
- Built db.js connection pool
- Created /db-test route, confirmed Express ↔ Postgres connection works

## Day 4 — Authentication: Signup
- Installed bcrypt
- Learned Express file structure best practices (imports → middleware → routes → listen)
- Built /signup route: hash password with bcrypt, insert into database
- Installed Postman for API testing
- Verified hashed password directly in database

## Day 5 — Authentication: Login & JWT
- Built /login route: look up user by email, compare password with bcrypt.compare
- Learned SQL Injection risk and why parameterized queries ($1) prevent it
- Learned why login errors should be generic (prevents user enumeration)
- Learned JWT concept: signed tokens, payload vs signature, why tokens expire
- Generated JWT_SECRET, wired into .env and docker-compose.yml
- Installed jsonwebtoken, implemented token generation on successful login