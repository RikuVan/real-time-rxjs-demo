# Real-time chat with http2 streaming and Rxjs

- This is a demo of client-side use of Rxjs to handle streams.

## Getting started:

- http2 requires https, so you will need to run the following (mac and linux) to create a self-signed certificate

```bash
openssl req -new -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
```

It is easier to test this in Firefox. This will start a server and an app on https://localhost:8080:

```
pnpm install -g pnpm
pnpm install
pnpm run start
```

There is also a simple 'playground' for showing examples using `pnpm run start:playground`

## Demo TODOs:

- refactor index.html script to handle chat streaming with Rxjs
- add auto-submit if the user pauses while typing for some period of time
