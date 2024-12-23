import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts', // Entry point
  output: [
    {
      file: 'dist/trame-react.cjs.js',
      format: 'cjs', // CommonJS for Node.js
      exports: 'named',
    },
    {
      file: 'dist/trame-react.esm.js',
      format: 'esm', // ES Module for modern bundlers
      exports: 'named',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
    terser(), // Minifies the output
  ],
  external: ['react', 'react-dom'], // Avoid bundling React dependencies
};