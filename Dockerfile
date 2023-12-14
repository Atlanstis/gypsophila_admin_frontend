FROM node:21-alpine3.17 as build-stage

WORKDIR /app

COPY . .

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm build

FROM nginx:1.25.3-alpine as production-stage

WORKDIR /app

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
