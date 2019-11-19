// https://raw.githubusercontent.com/vuejs/vue-cli/dev/packages/%40vue/babel-preset-app/index.js

function generatePolyFills(
  targets,
  isModern,
  polyfills = [
    "es.map",
    "es.promise",
    "es.object.assign",
    "es.array.iterator",
    "es.promise.finally",
  ],
) {
  const { isPluginRequired } = require("@babel/preset-env");
  const builtInsList = require("core-js-compat/data");
  const getTargets = require("@babel/preset-env/lib/targets-parser").default;
  const builtInTargets = getTargets(targets, {
    ignoreBrowserslistConfig: isModern,
  });

  return polyfills.filter((item) => {
    return isPluginRequired(builtInTargets, builtInsList[item]);
  });
}

module.exports = (
  api,
  options = {
    jsx: true,
  },
) => {
  const entryFiles = options.entryFiles || [];
  const isModernBuild = options.modern || false;

  // https://babeljs.io/docs/en/babel-preset-env
  let envOptions = {
    targets: options.targets || [],
    spec: options.spec,
    loose: options.loose || false,
    modules: options.modules || false,
    debug: options.debug || false,
    include: options.include,
    exclude: options.exclude || [],
    useBuiltIns: options.useBuiltIns || "usage",
    forceAllTransforms: options.forceAllTransforms,
    configPath: options.configPath,
    ignoreBrowserslistConfig: isModernBuild,
    shippedProposals: options.shippedProposals,
    corejs: {
      version: "core-js@3",
    },
  };

  let presets = [];
  let plugins = [];

  if (isModernBuild) {
    envOptions.targets = {
      esmodules: true,
    };
  }

  let polyfills = [];
  if (!isModernBuild) {
    polyfills = generatePolyFills(
      envOptions.targets,
      isModernBuild,
      options.polyfills,
    );
    envOptions.exclude.concat(polyfills);
    plugins.push([require("./polyfillsPlugin"), { polyfills, entryFiles }]);
  }

  if (options.jsx) {
    presets.push([
      require("@vue/babel-preset-jsx"),
      typeof options.jsx === "object" ? options.jsx : {},
    ]);
  }

  plugins.push(["@babel/plugin-syntax-dynamic-import"]);
  // https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html
  plugins.push([
    "@babel/plugin-transform-runtime",
    {
      useESModules: true,
      helpers: envOptions.useBuiltIns === "usage",
      regenerator: envOptions.useBuiltIns !== "usage",
      // polyfills are injected by preset-env & polyfillsPlugin, so no need to add them again
      corejs: false,
    },
  ]);

  presets.unshift(["@babel/preset-env", envOptions]);

  return {
    sourceType: "unambiguous",
    overrides: [
      {
        exclude: [/@babel[\/|\\\\]runtime/, /core-js/],
        presets,
        plugins,
      },
      {
        // there are some untranspiled code in @babel/runtime
        // https://github.com/babel/babel/issues/9903
        include: [/@babel[\/|\\\\]runtime/],
        presets: [
          [
            require("@babel/preset-env"),
            {
              useBuiltIns: envOptions.useBuiltIns,
              corejs: 3,
            },
          ],
        ],
      },
    ],
  };
};
