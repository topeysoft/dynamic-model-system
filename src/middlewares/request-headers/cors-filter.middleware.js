"use strict";
const config_manager_1 = require('../../configs/config-manager');
class CorsFilterMiddleware {
    /**
     *
     */
    constructor(app) {
        this.app = app;
        var config = config_manager_1.ConfigManager.getConfig();
        this.app.use(function (req, res, next) {
            var origin = req.headers.origin;
            if (config.cors.allowed_origins.indexOf(origin) > -1) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
            res.setHeader('Access-Control-Allow-Methods', config.cors.allowed_methods);
            res.setHeader('Access-Control-Allow-Headers', config.cors.allowed_headers);
            res.setHeader('Access-Control-Allow-Credentials', config.cors.allow_credentials);
            next();
        });
    }
}
exports.CorsFilterMiddleware = CorsFilterMiddleware;
//# sourceMappingURL=cors-filter.middleware.js.map