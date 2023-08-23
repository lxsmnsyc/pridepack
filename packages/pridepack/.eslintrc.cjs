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
    "no-param-reassign": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "no-await-in-loop": "off",
    "no-restricted-syntax": "off"
  },
};