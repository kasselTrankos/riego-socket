module.exports = {
  "presets": [
    [
      "@babel/preset-env",

      {
        debug: true,
        useBuiltIns: 'usage',
        "targets": {
          "ie": "11"
        }
      }
    ]
  ],
  exclude: /node_modules\/.*/
};