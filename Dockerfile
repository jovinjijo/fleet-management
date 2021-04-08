FROM node:14-alpine

ENV APP_ID=api
ENV PORT=4000
ENV OPENAPI_SPEC=/api/v1/spec

WORKDIR /home/fleet-management
COPY . .

RUN yarn install
RUN yarn run build

ENV NODE_ENV=production

EXPOSE 4000

CMD ["yarn", "run", "start:prod"]