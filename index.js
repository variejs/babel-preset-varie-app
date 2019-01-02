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

	const isModernBuild = options.modern || false

	// https://babeljs.io/docs/en/babel-preset-env
	let envOptions = {
		targets : options.targets || [],
		spec : options.spec,
		loose : options.loose || false,
		modules : options.modules || false,
		debug : options.debug || false,
		include : options.include,
		exclude : options.exclude || [],
		useBuiltIns : options.useBuiltIns || 'usage',
		forceAllTransforms : options.forceAllTransforms,
		configPath : options.configPath,
		ignoreBrowserslistConfig : isModernBuild,
		shippedProposals : options.shippedProposals,
	}

	let presets = [];
  let plugins = [];

  if (isModernBuild) {
		envOptions.targets = {
      esmodules: true
    };
  }

  let polyfills = [];
  if (!isModernBuild) {
    polyfills = generatePolyFills(envOptions.targets, options.polyfills);
		envOptions.exclude.concat(polyfills)
    plugins.push([require("./polyfillsPlugin"), { polyfills }]);
  }

  if (options.jsx) {
    plugins.push(
      require("@babel/plugin-syntax-jsx"),
      require("babel-plugin-transform-vue-jsx")
    );
  }

  plugins.push(["@babel/plugin-syntax-dynamic-import"]);
	// https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html
  plugins.push([
    "@babel/plugin-transform-runtime",
    {
			useESModules: true,
			helpers: envOptions.useBuiltIns === 'usage',
			regenerator: envOptions.useBuiltIns !== 'usage',
			// "2" is the core-js version used
			corejs: envOptions.useBuiltIns === 'usage' ? 2 : false,
    }
  ]);

  presets.push([
    "@babel/preset-env",
		envOptions
  ]);

  return {
    presets,
    plugins
  };
};
