# Migration runner commands

Assumes migrations are in `migrations/sql`.

## Knex
```bash
npm i -D knex
npx knex init
# configure knexfile.js -> migrations.directory = './migrations/sql'
npx knex migrate:latest
npx knex migrate:rollback
```

## Prisma
```bash
npm i -D prisma
npx prisma init
# for raw SQL migration folder usage
npx prisma migrate dev --name init
npx prisma migrate deploy
```

## Drizzle
```bash
npm i -D drizzle-kit
# configure drizzle.config.ts with out: './migrations/sql'
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Flyway
```bash
# SQL files should be named V1__init.sql, V2__...sql for Flyway conventions
flyway -url="$DATABASE_URL" -locations="filesystem:./migrations/sql" migrate
flyway -url="$DATABASE_URL" -locations="filesystem:./migrations/sql" info
flyway -url="$DATABASE_URL" -locations="filesystem:./migrations/sql" rollback
```
