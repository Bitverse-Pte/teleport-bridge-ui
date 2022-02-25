# Teleport Network Bridge UI

connect chains all together

## Preview

View [QA](https://bridge.qa.davionlabs.com/)

## Scripts Illustration

for development:

```bash
yarn dev
```

for CI:

```bash
yarn # install dependencies
```

for CD:

```bash
yarn build # build server/client code before start ssr process
yarn start
```

## Required Environments Variables

create a .env file inside the project folder with below content before "yarn build"

```
BACKEND_URL=[the internal url to call bridge backend service in cloud cluster]
```

## Environment Variables For Development

create a .env.local at the root path with below content:

> BACKEND_URL="https://bridge.qa.davionlabs.com"
