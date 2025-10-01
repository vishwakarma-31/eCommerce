/**
 * Babel configuration for frontend tests
 */
export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};