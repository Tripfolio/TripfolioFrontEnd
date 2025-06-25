module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended", 
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["import", "unicorn"],
  "rules": {
    "no-console": "warn",
    "no-debugger": "error",
    "eqeqeq": ["error", "always"],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-undef": "error",
    "no-use-before-define": ["error", { "functions": true, "classes": true }],
    "no-empty": ["error", { "allowEmptyCatch": false }],
    "no-empty-function": "warn",
    "require-await": "warn",
    "no-throw-literal": "error",
    "default-case": "warn",
    "consistent-return": "warn",
    "no-magic-numbers": [
      "warn",
      {
        "ignore": [0, 1, -1, 100, 200, 400, 401, 403, 404, 500],
        "ignoreArrayIndexes": true,
        "enforceConst": true,
        "detectObjects": false
      }
    ],
    "unicorn/filename-case": [
      "error",
      {
        "cases": {
          "camelCase": true,
          "kebabCase": true
        }
      }
    ],
    "import/order": [
      "warn",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always"
      }
    ]
  }
}

