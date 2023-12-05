import pkg from "./package.json" assert { type: "json" };
import external from "rollup-plugin-peer-deps-external";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";

import esbuild from "rollup-plugin-esbuild";

export default [
  {
    input: pkg.source,
    output: [
      { file: pkg.main, format: "cjs", exports: "named", sourcemap: true },
      { file: pkg.module, format: "esm", exports: "named", sourcemap: true },
    ],
    plugins: [del({ targets: ["dist/*"] }), external(), esbuild()],
  },
  {
    input: pkg.source,
    output: [{ file: pkg.types, format: "es" }],
    external: [/\.scss$/, /\.css$/],
    plugins: [
      dts({
        compilerOptions: {
          baseUrl: "./src",
        },
      }),
    ],
  },
];
