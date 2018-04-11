const path = require('path');

module.exports = {
    entry: {
        bootstrap: ['./public/src/index.js', 
                    './public/css/styles.css']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './public/js')
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    }
};