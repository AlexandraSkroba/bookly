FROM node:18.12.1
RUN apt-get update -qq && apt-get install -y build-essential apt-utils libpq-dev postgresql-client
WORKDIR '/app'
RUN npm install
COPY . .

ARG DEFAULT_PORT 3001

EXPOSE ${DEFAULT_PORT}
CMD ["nest", "start"]
