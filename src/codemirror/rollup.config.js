import {nodeResolve} from "@rollup/plugin-node-resolve"

export default {
  input: './import.js',
  output: {
    file: "./codemirror.js",
    format: 'es'
  },
  inlineDynamicImports: true,
  plugins: [nodeResolve()],
  treeshake: false
};
