module.exports = (api) => {
  const presets = ['react-app'];
  const plugins = [
    '@babel/plugin-transform-modules-commonjs',
    'inline-react-svg',
    ['babel-plugin-transform-builtin-extend', {
      globals: ['Error', 'Array'],
    }],
  ];

  api.cache(false);

  return {
    presets,
    plugins,
  };
};
