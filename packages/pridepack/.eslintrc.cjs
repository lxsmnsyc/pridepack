module.exports = {
  "root": true,
  "extends": [
    "lxsmnsyc/typescript"
  ],
  "parserOptions": {
    "project": "./tsconfig.eslint.json",
    "tsconfigRootDir": __dirname,
  },
  "rules": {
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "no-await-in-loop": "off"
  },
};