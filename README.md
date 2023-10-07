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

See [templates](https://github.com/lxsmnsyc/pridepack/tree/master/templates)

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

### `pridepack start`

Runs the index file (based on `package.json`'s `type`) in production mode, respectively.

### `pridepack dev`

Runs the index file in development mode and runs the build in watch mode. Auto-reloads when detecting changes.

## Environment Variables

Pridepack automically loads variables from `.env`, `.env.production` and `.env.development` whenever it is available, and uses the variables during compile-time. Variables are going to be registered under `process.env` or `import.meta.env`.

`process.env.NODE_ENV` provides a way to check whether or not the code is being built during production or development mode. The same goes to `import.meta.env.MODE`, `import.meta.env.DEV` and `import.meta.env.PROD`

```js
if (process.env.NODE_ENV === 'development') {
  // do stuff
}
// the same as
if (import.meta.env.MODE === 'development') {
  // do stuff
}
if (import.meta.env.DEV) {
  // ...
}
if (!import.meta.env.PROD) {
  // ...
}
```

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

```js
// pridepack config fields and their default values.
{
  // Directory where the bundled output is going to be generated
  "outputDir": "dist",
  // Path to the tsconfig.json
  "tsconfig": "tsconfig.json",
  // Optional, maps the subpackage entrypoint to the source file
  // This is used for generating the `exports` field and constructing
  // the subpackages. The default value is below.
  "entrypoints": {
    ".": "src/index.ts", // Maps to `my-package`
    // Example other entrypoint (not a default value)
    "./example": "src/example.ts" // Maps to `my-package/example`
  },
  // Refers to the target entrypoint to be used for `start` and `dev` commands
  // Value is mapped from `entrypoints`
  "startEntrypoint": ".",
  // Target ES version or Browser versions, see https://esbuild.github.io/api/#target
  "target": "es2018",
  // What to do with JSX expressions, see https://esbuild.github.io/api/#jsx
  "jsx": "transform",
  // See https://esbuild.github.io/api/#jsx-factory
  "jsxFactory": "React.createElement",
  // See https://esbuild.github.io/api/#jsx-fragment
  "jsxFragment": "React.Fragment",
  // Can only be used on JS config files, allows usage of ESBuild plugins
  // This field can also accept a callback that receives the current compilation mode
  // 
  "plugins": ({ isDev, isESM, isCJS }) => [
    somePlugin({ isDev }),
  ],
}
```

## Soon

- Code-splitting (requires ESBuild)

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
