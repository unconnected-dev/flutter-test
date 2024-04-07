import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
	input: 'src/core.js',
	output: {
		file: 'bundle.js',
		format: 'iife',
        sourcemap: true
	},
	plugins: [  
        nodeResolve({
            preferBuiltins: false,
            browser: true
        }),
        commonjs()
    ],
    preserveSymlinks: false
};