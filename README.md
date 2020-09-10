# pridepack

> Zero-config CLI for building Typescript packages.

## Install

```bash
npm install -g pridepack
```

```bash
yarn global add pridepack
```

### 🚧 WORK-IN-PROGRESS. 🚧

## Features

- Extremely-fast package building: Using [ESBuild](https://github.com/evanw/esbuild), you can build your packages in just seconds.
- Linter setup: Creating a project with proper linting tools is already made for you.
- Zero-config: No need to customize your building process, `pridepack` already handles that for you.
 
### Usage

#### `pridepack init [template]`

#### `pridepack create <name> [template]`

#### `pridepack build`

#### `pridepack lint`

#### `pridepack check`

## Roadmap

- [X] ESM and CJS Bundler
- [X] Templates
- [X] Project Generator
- [X] Code Linter (using ESLint)
- [X] Typechecking
- [ ] Built-in testing (using Jest)
- [ ] Watch mode (for build and test)
- [ ] Code-splitting (using ESBuild)
- [ ] Test example for React template using [react-testing-library](https://github.com/testing-library/react-testing-library) and/or [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library)
- [ ] Test example for Preact template using [preact-testing-library](https://github.com/testing-library/preact-testing-library) and/or [preact-hooks-testing-library](https://github.com/testing-library/preact-hooks-testing-library)

## License

MIT © [Lyon Software Technologies, Inc.](https://github.com/LyonInc)
