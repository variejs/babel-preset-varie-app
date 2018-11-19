export default function (context, options = {}) {

  console.info(context);
  console.info(options);

  let targets = undefined;
  // if (options.isModernBuild) {
  //   targets = {
  //     esmodules: true
  //   };
  // }

  // TODO - how do we pass in the modern build ?

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
          // ignoreBrowserslistConfig: options.isModernBuild
        }
      ]
    ],
    plugins: [
      ["@babel/plugin-syntax-dynamic-import"],
      [
        "@babel/plugin-transform-runtime",
        {
          regenerator: false,
          corejs: false,
          helpers: true,
          useESModules: true
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