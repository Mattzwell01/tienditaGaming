const fs = require("fs");
const os = require("os");
const path = require("path");

function buscarChrome() {
  const cache = path.join(os.homedir(), ".cache", "puppeteer", "chrome");

  if (fs.existsSync(cache)) {
    const carpetas = fs.readdirSync(cache);

    for (const carpeta of carpetas) {
      const rutas = [
        path.join(cache, carpeta, "chrome-mac-arm64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing"),
        path.join(cache, carpeta, "chrome-mac-x64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing"),
      ];

      for (const ruta of rutas) {
        if (fs.existsSync(ruta)) {
          return ruta;
        }
      }
    }
  }

  const rutasSistema = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];

  for (const ruta of rutasSistema) {
    if (fs.existsSync(ruta)) {
      return ruta;
    }
  }

  return null;
}

const rutaChrome = buscarChrome();

if (rutaChrome) {
  process.env.CHROME_BIN = rutaChrome;
} else {
  console.log("No se encontro Chrome, se usara el que este instalado en el sistema");
}

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],

    files: ["tests/**/*.spec.jsx"],

    preprocessors: {
      "tests/**/*.spec.jsx": ["webpack"],
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
            type: "asset/resource",
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.(js|jsx)$/,
            oneOf: [
              {
                include: path.resolve(__dirname, "src"),
                use: [
                  { loader: path.resolve(__dirname, "karma.instrumentador.cjs") },
                  { loader: "babel-loader" },
                ],
              },
              {
                exclude: /node_modules/,
                use: "babel-loader",
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: [".js", ".jsx"],
      },
    },

    webpackMiddleware: {
      stats: "errors-only",
    },

    reporters: ["progress", "coverage"],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    concurrency: 1,

    browsers: ["ChromeHeadless"],

    customLaunchers: {
      ChromeHeadlessSinSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
      },
    },

    coverageReporter: {
      dir: "coverage/",
      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "lcovonly" },
      ],
    },
  });
};
