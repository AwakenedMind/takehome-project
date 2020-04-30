const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	// Production
	app.use(
		proxy('/.netlify/functions/server/api', {
			target: 'http://localhost:9000/',
		})
	);

	// Development
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://localhost:5000',
			changeOrigin: true,
		})
	);
};
