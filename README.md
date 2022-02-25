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
yarn build # build server/client code
```

for CD:
```bash
yarn start
```

## Required Environments Variables

execute such command before start the project in online environment, such as QA and PROD
```bash
export NEXT_PUBLIC_BACKEND_URL=[the internal url to call bridge backend service in cloud cluster]
```

## Environment Variables For Development
create a .env.local at the root path with below content:
>  NEXT_PUBLIC_BACKEND_URL="https://bridge.qa.davionlabs.com"
