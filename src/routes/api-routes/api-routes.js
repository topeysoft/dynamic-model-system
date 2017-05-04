"use strict";
const express_1 = require('express');
const devices_routes_1 = require('./devices-routes');
class ApiRoutes {
    constructor(app, basePath = '/api') {
        var router = express_1.Router();
        router.get('/', function (req, res) {
            res.json({ message: 'Welcome to our api!' });
        });
        new devices_routes_1.DevicesApiRoute(router);
        app.use(basePath, router);
    }
}
exports.ApiRoutes = ApiRoutes;
//# sourceMappingURL=api-routes.js.map