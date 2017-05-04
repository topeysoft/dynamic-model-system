import { Express, Request } from 'express';

const jwt = require('express-jwt');

export class Authorize {
    /**
     *
     */
    constructor(app: Express) {
        this.setup(app);
    }

    private setup(app: Express) {
        app.use(jwt({
            secret: "super-secret here",
           credentialsRequired: false,
            getToken: function fromHeaderOrQuerystring(req:Request) {
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                } else if (req.query && req.query.token) {
                    return req.query.token;
                }
                return null;
            },
            audience: 'your audience id here',
            issuer: "https://issuer.example.com/",
            algorithms: ['HS256']
        }));
    }

}
