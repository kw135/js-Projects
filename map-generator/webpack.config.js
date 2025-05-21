const path = require('path');
module.exports = {
    entry: [
        './src/main.ts',
        './src/app.ts',
        './src/mapTile.ts',
        './src/imgTile.ts',
        './src/tileoperations.ts'
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    watch: true
}