module.exports = {
    mutator: "javascript",
    packageManager: "npm",
    reporters: ["clear-text", "progress"],
    testRunner: "mocha",
    transpilers: [],
    testFramework: "mocha",
    coverageAnalysis: "perTestInIsolation",
    mochaOptions:{
      spec: ['tests/*.spec.js']
    },
    mutate: [
      'index.js',
      'domain/**/*.js'
    ],
    maxConcurrentTestRunners: 2
};
