# Crystal

We want to make crystal clear analytics.

# Stack

### CI

- github actions probably
- or google build

### Front

- Lang: Typescript
- General Framework: ??
- UI: React
- State: Zustand
- Style: Tailwind
- Theme: Glass Morphism + cyberpunk
- Build: Vite + esbuild -> bundle, tooling
- lint + prettier
- Hosting: Firebase
- DB: Firestore
  - API: FS avec des événement bidirectionnels pour update front dynamiquement sans api

### Data pipeline: -> gcr (google cloud run)

- X jours
- Runtime Python en docker avec un serveur flask
- SQL => CSV ou un json
  -> push sur l’api

### Web3

- Smart Contract pour l’abonnement
- Zeppelin
- Truffle + ganache

# TODO

- [ ] Hello world Front with Next + vite + tailwind + firebase deploy
