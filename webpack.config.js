const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'production', // Use 'development' for local debugging
    entry: './scripts.js', // Your main JavaScript file
    output: {
        filename: 'bundle.js', // Name of the output bundle
        path: path.resolve(__dirname, 'dist'), // Output directory
        publicPath: '/', // Ensures the correct path for dynamic imports or resources
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Apply this rule to JavaScript files
                exclude: /node_modules/, // Skip processing node_modules
                use: {
                    loader: 'babel-loader', // Transpile JS using Babel
                    options: {
                        presets: ['@babel/preset-env'], // Use Babel preset for modern JS
                    },
                },
            },
        ],
    },
    plugins: [
        new Dotenv({
            path: './.env', // Path to your .env file
            systemvars: true, // Allow fallback to system environment variables
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // Serve files from the output directory
        },
        port: 3000, // Specify the development server port
        open: true, // Automatically open the app in the browser
        compress: true, // Enable gzip compression for everything served
        hot: true, // Enable Hot Module Replacement (HMR)
        historyApiFallback: true, // Redirect 404s to /index.html for SPAs
    },
    resolve: {
        fallback: {
            fs: false, // Resolve "fs" module not found error for browser environments
        },
    },
};
