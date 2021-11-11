# Crystal

We want to make crystal clear analytics.

# Stack

### CI

- github actions probably
- or google build

### Front

- [x] Lang: Typescript
- [x] UI: React
- [ ] State: Zustand
- [x] Style: Tailwind
- [x] Theme: Glass Morphism + cyberpunk
- [x] Build: Vite + esbuild -> bundle, tooling
- [x] lint + prettier
- [x] dataviz: https://nivo.rocks
- [x] table: react table https://www.samuelliedtke.com/blog/react-table-tutorial-part-1/
- [x] Hosting: Firebase https://www.npmjs.com/package/firebase-tools
- [ ] DB: Firestore
  - API: FS avec des événement bidirectionnels pour update front dynamiquement sans api

### Data pipeline: -> gcr (google cloud run)

- X jours
- Runtime Python en docker avec un serveur flask
- SQL => CSV ou un json
  -> push sur l’api

### Web3

- [ ] SC: Smart Contract pour l’abonnement
  - [ ] Zeppelin
- [ ] Tooling: Truffle + ganache

# TODO

- [x] Hello world Front with Next + vite + tailwind + firebase deploy
- [ ] add husky hooks for format and lint
