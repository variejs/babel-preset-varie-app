// https://raw.githubusercontent.com/vuejs/vue-cli/dev/packages/%40vue/babel-preset-app/index.js

function generatePolyFills(
  targets,
  defaultPolyFills = [
    "es6.promise",
    "es6.array.iterator",
    "es7.promise.finally"
  ]
) {
  const { isPluginRequired } = require("@babel/preset-env");
  const builtInsList = require("@babel/preset-env/data/built-ins.json");
  const getTargets = require("@babel/preset-env/lib/targets-parser").default;
  const builtInTargets = getTargets(targets);

  return defaultPolyFills.filter(item => {
    return isPluginRequired(builtInTargets, builtInsList[item]);
  });
}

module.exports = (
  api,
  options = {
    jsx: false
  }
) => {
  const isModernBuild = options.modern || false;

  let presets = [];
  let plugins = [];
  let targets = undefined;

  if (isModernBuild) {
    targets = {
      esmodules: true
    };
  }

  let polyfills = [];
  if (!isModernBuild) {
    polyfills = generatePolyFills(targets, options.polyfills);
    plugins.push([require("./polyfillsPlugin"), { polyfills }]);
  }

  if (options.jsx) {
    plugins.push(
      require("@babel/plugin-syntax-jsx"),
      require("babel-plugin-transform-vue-jsx")
    );
  }

  plugins.push(["@babel/plugin-syntax-dynamic-import"]);
  plugins.push([
    "@babel/plugin-transform-runtime",
    {
      corejs: false,
      helpers: true,
      regenerator: false,
      useESModules: true
    }
  ]);
  plugins.push([
    "@babel/plugin-proposal-object-rest-spread",
    {
      useBuiltIns: "usage"
    }
  ]);

  presets.push([
    "@babel/preset-env",
    {
      targets,
      loose: false,
      debug: false,
      modules: false,
      useBuiltIns: "usage",
      ignoreBrowserslistConfig: isModernBuild
    }
  ]);

  return {
    presets,
    plugins
  };
};
