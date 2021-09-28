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

See [templates](https://github.com/LyonInc/pridepack/tree/master/templates)

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

### `pridepack start` / `pridepack dev`

Runs the index file (based on `package.json`'s `type`) in production or development mode, respectively. `dev` does not perform auto-reload.

## Config

Even though Pridepack encourages zero-config setup, Pridepack also includes config files. Pridepack config files can be either of the following:

- `.pridepackrc`
- `.pridepack.json`
- `.pridepack.config.json`
- `pridepack.json`
- `pridepack.config.json`

JS Config files are also supported, useful for loading environment variables and more.

- `.pridepack.js`
- `.pridepack.config.js`
- `pridepack.js`
- `pridepack.config.js`

### Fields

- `srcFile`: path of the entry source file. Defaults to `src/index.ts`.
- `target`: ECMAScript version target. Defaults to `esnext`.
- `tsconfig`: path of Typescript config file. Defaults to `tsconfig.json`.
- `jsx`: How JSX expressions should be interpreted. Defaults to `react`. Use `preserve` to preserve JSX syntax.
- `jsxFactory`: JSX pragma.
- `jsxFragment`: JSX Fragment expression pragma.
- `jest`: Jest config.
- `plugins`: ESBuild plugins to be used for bundling. You can check the official [ESBuild Community Plugins](https://github.com/esbuild/community-plugins).

### Exports Map

Build files are automatically inferred from exports map. `pridepack` prioritizes the `"exports"` field for resolving target CJS and ESM builds. If the `"exports"` field isn't defined, it will use the `"module"` and `"main"` field, respectively.

For types, the output file is inferred from the `"types"` field.

## Soon

- Code-splitting (requires ESBuild)

## Migrating to `0.13.0`

### `package.json`

The following entrypoints must now be provided.  `./esm` and  `./cjs` entrypoints are optional.

```json
{
  "types": "dist/types/index.d.ts",
  "main": "dist/cjs/production/index.js",
  "module": "dist/esm/production/index.js",
  "exports": {
    ".": {
      "development": {
        "require": "./dist/cjs/development/index.js",
        "import": "./dist/esm/development/index.js"
      },
      "require": "./dist/cjs/production/index.js",
      "import": "./dist/esm/production/index.js"
    },
    "./dev": {
      "production": {
        "require": "./dist/cjs/production/index.js",
        "import": "./dist/esm/production/index.js"
      },
      "require": "./dist/cjs/development/index.js",
      "import": "./dist/esm/development/index.js"
    },
    "./esm": {
      "development": "./dist/esm/production/index.js",
      "production": "./dist/esm/production/index.js",
      "default": "./dist/esm/production/index.js"
    },
    "./cjs": {
      "development": "./dist/cjs/production/index.js",
      "production": "./dist/cjs/production/index.js",
      "default": "./dist/cjs/production/index.js"
    }
  },
}
```

For scripts, if you are using a start command for running the index file (e.g. fastify-based templates), you may add the following to the `scripts` field:

```json
{
  "start": "pridepack start",
  "dev": "pridepack dev",
}
```

## License

MIT © [Lyon Software Technologies, Inc.](https://github.com/LyonInc)
