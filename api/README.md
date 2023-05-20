## Glitch PolyChat API 

<br/>
The PolyChat API is basically made for a private connection that is used in the app. As a simple feature, we implemented the chat through CRUD and SSE to show in the chat. For the correctness of the event handling, it is made to be processed after it is stored in the database through pg notify. Later, depending on the resource situation, you can change to WS to handle it.

This API is basically made with nest.js and manages data through Postgresql. 
### Installation

```bash
yarn install
```

```bash
npx prisma generate
```

```bash
yarn build
```
```bash
yarn start:dev
```

###  Api Documentation
The API specification is written through Swagger, so you can view the specification via the link below.
```bash
http://localhost:8888/swagger
```

### Health Check
```bash
http://localhost:8888/health
```

### Env
You can use .env for configuration. 
```
DATABASE_URL="postgresql://${userid}:${user_password}@${hosturl}:5432/${database}?schema=public"
```

### Docker Image Public Download
We've set it up to build images via Docker, and you can easily download the latest image from our public ECR address to get it up and running. 
```
public.ecr.aws/bisonai/glitch:api.v.20230520.1551.44e46e8
```

