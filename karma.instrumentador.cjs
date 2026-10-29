const { createInstrumenter } = require("istanbul-lib-instrument");

module.exports = function (source) {
  const instrumentador = createInstrumenter({
    coverageVariable: "__coverage__",
    esModules: true,
    compact: false,
  });

  return instrumentador.instrumentSync(source, this.resourcePath);
};
