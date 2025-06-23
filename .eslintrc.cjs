module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  globals: {
    google: "readonly",
    defineProps: "readonly",
    defineExpose: "readonly",
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: "module",
    extraFileExtensions: [".vue"],
    vueFeatures: {
      scriptSetup: true,
    },
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended"],
  plugins: ["vue"],
  rules: {
    "no-unused-vars": "error",
    // ⛔ 錯誤級別：禁止定義了但沒有使用的變數，例如：let x; // x 沒有用到就會報錯
    "no-console": "warn",
    // ⚠️ 警告級別：當程式中出現 console.log、console.error 等時會發出警告，但不會阻止編譯
    eqeqeq: "error",
    // ⛔ 錯誤級別：強制使用 === 和 !==，禁止使用 == 或 !=，以避免型別轉換錯誤
    "vue/multiline-html-element-content-newline": "off", // 關閉多行 HTML 元素內容必須換行的規則
    "vue/singleline-html-element-content-newline": "off", // 關閉單行 HTML 元素內容不允許換行的規則
    "vue/html-indent": "off", // 關閉 HTML 縮排規則
    "vue/multi-word-component-names": "off", // 關閉元件名稱必須是多字的規則
    "vue/attributes-order": "off", // 關閉 HTML 屬性排序規則
    "vue/html-self-closing": "off", // 關閉自閉合標籤格式規則
    "vue/max-attributes-per-line": "off", // 關閉每行最大屬性數限制規則
    "vue/html-closing-bracket-spacing": "off", // 關閉結束標籤括號空格規則
    "vue/html-closing-bracket-newline": "off", // 關閉結束標籤換行規則
    "vue/attribute-hyphenation": "off", // 關閉屬性連字元命名規則
    "vue/no-multi-spaces": "off", // 關閉禁止多重空白字元規則
    "vue/first-attribute-linebreak": "off", // 關閉首個屬性必須換行規則
  },
};
