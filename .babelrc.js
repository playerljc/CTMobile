const presets = ["@babel/preset-env"];
let plugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-proposal-function-bind"
];

const argv = process.argv;
const typeIndex = argv.findIndex((t) => {
  return t === '--type';
});
if (typeIndex !== -1) {
  const type = argv[typeIndex + 1];
  if (type) {
    console.log(type);
    if (type === 'umd') {
      plugins = [
        "@babel/plugin-proposal-function-bind",
        [
          "@babel/plugin-transform-modules-umd",
          {
            "globals": {
              "index": "CtMobile",
            },
            "exactGlobals": true
          }
        ]
      ];
      console.log(plugins);
    }
  }
}

module.exports = {presets, plugins};
