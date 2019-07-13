module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.43.43:5000',
                ws: true,
                changeOrigin: true
            },
        }
    }
};
