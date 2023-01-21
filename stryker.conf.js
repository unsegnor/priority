module.exports = {
    packageManager: "npm",
    reporters: ["clear-text", "progress"],
    testRunner: "mocha",
    coverageAnalysis: "perTest",
    mochaOptions:{
      spec: ['tests/*.spec.js']
    },
    mutate: [
      'index.js',
      'domain/**/*.js'
    ],
    concurrency: 2
};
