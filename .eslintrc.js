module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    requireConfigFile: false,
  },
  extends: [
    '@wavesenterprise/eslint-config/typescript-mixed',
  ],
  rules: {
    "no-empty-function": "off",
    "no-redeclare": "off"
  }
};
