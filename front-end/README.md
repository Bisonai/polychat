<!-- # BAGC

## HOW TO RUN
### 1. Install Docker and docker-compose

### 2. Build and run

### a. Development
```shell
docker compose -f docker-compose.dev.yml build
docker compose -f docker-compose.dev.yml --env-file .env up --remove-orphans
```

### a. Production
```shell
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml --env-file .env up
```

### Database connection
Get in to the mysql container
```
  docker exec -it mysql bash
  mysql -u root -p
``` -->

# BAGC

## HOW TO RUN

### 1. Install packages

```
yarn install
```

### 2. Init prisma

```
npx prisma db pull
npx prisma generate
```

### 3. Build and run

### a. Development

```shell
yarn dev
```

### a. Production

```shell
yarn build
yarn start
```
