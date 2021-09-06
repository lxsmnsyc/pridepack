FROM mhart/alpine-node
WORKDIR /
COPY dist ./dist
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn install --production
EXPOSE 8080
CMD [ "node", "./dist/cjs/" ]
