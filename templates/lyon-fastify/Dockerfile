FROM mhart/alpine-node
WORKDIR /
COPY dist ./dist
COPY package.json ./package.json
RUN yarn install --production
EXPOSE 8080
CMD [ "node", "./dist/cjs/" ]
