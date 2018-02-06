## Build Setup

Client:

``` bash
# client --- vue project
npm install || yarn install

# client with hot reload at localhost:6060
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

Server:

``` bash
# server --- koa project
npm install || yarn install

# run server --- develop
npm start

# run server --- production
pm2 start app.js
```
