// https://raw.githubusercontent.com/vuejs/vue-cli/dev/packages/%40vue/babel-preset-app/polyfillsPlugin.js

// add polyfills to app entries
module.exports = () => {
  return {
    name: "varie-app-inject-polyfills",
    visitor: {
      Program(path, state) {
        if (!state.opts.entryFiles.includes(state.filename)) {
          return;
        }
        const { polyfills } = state.opts;
        const { createImport } = require("@babel/preset-env/lib/utils");
        // imports are injected in reverse order
        polyfills
          .slice()
          .reverse()
          .forEach((polyfill) => {
            createImport(path, polyfill);
          });
      },
    },
  };
};
