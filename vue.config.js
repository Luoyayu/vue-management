module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://10.0.0.188:5000/',
                ws: true,
                changeOrigin: true
            },
        }
    }
};
