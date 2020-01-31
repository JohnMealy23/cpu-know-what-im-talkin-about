module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/test/",
    "/__tests__/",
    "/dist/",
    "/config/",
    "/jestSetup.js"
  ],
  "testRegex": "(/tests/.*|(\\.|/)(test|spec))\\.ts?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/mocks/",
  ]
}
