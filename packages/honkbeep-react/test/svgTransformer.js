module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));
    const componentName = `Svg${pascalCaseFilename}`;
    return `
    const React = require('react');
    module.exports = {
      __esModule: true,
      default: ${assetFilename},
      ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
        return {
          $$typeof: Symbol.for('react.element'),
          type: 'svg',
          ref: ref,
          key: null,
          props: Object.assign({}, props, {
            children: ${assetFilename}
          })
        };
      }),
    };`;
  },
  getCacheKey() {
    // The output is always the same.
    return "svgTransform";
  },
};
