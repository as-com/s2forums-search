FROM nodesource/trusty:5.3.0

ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 8000
CMD ["npm","start"]
