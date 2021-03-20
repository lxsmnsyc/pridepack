# pridepack

> Zero-config CLI for building Typescript packages.

## Install

```bash
npm install -g pridepack
```

```bash
yarn global add pridepack
```

## Features

- Extremely-fast package building: Using [ESBuild](https://github.com/evanw/esbuild), you can build your packages in just seconds.
- Linter setup: Creating a project with proper linting tools is already made for you.
- Zero-config: No need to customize your building process, `pridepack` already handles that for you.

### Templates

Pridepack currently ships with the following templates:
- `basic`: Basic Typescript package setup.
- `react`: React + Typescript package setup, includes `@testing-library/react` and `@testing-library/react-hooks`.
- `preact`: Preact + Typescript package setup, includes `@testing-library/preact` and `@testing-library/preact-hooks`
- `fastify`: Fastify package setup

## Usage

### `pridepack init [template]`

Initializes current working directory with the selected template. Package name is derived from the working directory's name.

### `pridepack create <name> [template]`

Creates a new project directory from the given template. `<name>` is any valid NPM package name. Project directory's name is derived from the supplied package name.

### `pridepack clean`

Cleans output directory. Use this everytime there are added/removed files from the source directory.

### `pridepack build`

Builds the source directory using ESBuild and emits type declaration files.

### `pridepack watch`

Builds the source directory in watch mode.

### `pridepack lint`

Lints the project using ESLint and the provided ESLint config.

### `pridepack check`

Runs no-emit type-checking.

### `pridepack test`

Runs test suites using Jest. You can also add valid command-line Jest arguments, which will be merged with the `jest` field from the Pridepack config file.

## Config

Even though Pridepack encourages zero-config setup, Pridepack also includes config files. Pridepack config files can be either of the following:
- `.pridepackrc`
- `.pridepack.json`
- `.pridepack.config.json`
- `pridepack.json`
- `pridepack.config.json`

Currently, JS config files are not yet supported.

### Fields

- `srcFile`: path of the entry source file. Defaults to `index.ts` (relative to `srcDir).
- `target`: ECMAScript version target. Defaults to `esnext`.
- `tsconfig`: path of Typescript config file. Defaults to `tsconfig.json`.
- `jsxFactory`: JSX pragma.
- `jsxFragment`: JSX Fragment expression pragma.
- `jest`: Jest config.

### Exports Map

Build files are automatically inferred from exports map. `pridepack` prioritizes the `"exports"` field for resolving target CJS and ESM builds. If the `"exports"` field isn't defined, it will use the `"module"` and `"main"` field, respectively.

For types, the output file is inferred from the `"types"` field.

## Soon

- Code-splitting (requires ESBuild)
- Conditional exports for user-defined paths.

## License

MIT © [Lyon Software Technologies, Inc.](https://github.com/LyonInc)
