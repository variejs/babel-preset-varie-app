module.exports = (api, options = {}) => {

  const isModernBuild = options.modern || false;

  let targets = undefined;
  if (isModernBuild) {
    targets = {
      esmodules: true
    };
  }

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets,
          loose: false,
          debug: false,
          modules: false,
          // useBuiltIns: "usage", // TODO
          ignoreBrowserslistConfig: isModernBuild
        }
      ]
    ],
    plugins: [
      ["@babel/plugin-syntax-dynamic-import"],
      [
        "@babel/plugin-transform-runtime",
        {
          corejs: false,
          helpers: true,
          regenerator: false,
          useESModules: true,
        }
      ],
      [
        "@babel/plugin-proposal-object-rest-spread",
        {
          useBuiltIns: "entry"
        }
      ]
    ]
  }
}