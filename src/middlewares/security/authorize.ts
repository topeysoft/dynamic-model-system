import { Express, Request } from 'express';

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

export class Authorize {
    /**
     *
     */
    constructor(app: Express) {
        this.setup(app);
    }

    private setup(app: Express) {
        // const checkJwt = jwt({
        //     secret: jwksRsa.expressJwtSecret({
        //         cache: true,
        //         rateLimit: true,
        //         jwksRequestsPerMinute: 5,
        //         jwksUri: `https://topeysoft.auth0.com/.well-known/jwks.json`
        //     }),

        //     audience: 'http://api.topeysoft.local',
        //     issuer: "https://topeysoft.auth0.com/",
        //     algorithms: ['HS256']
        // });
        app.use(jwt({
            secret: "B8Wbhz81Gar4dr9xzhTvXUJOzHmTCteT8dkl98YYCjDX46SCd7a3tb-UO-nUXuTE",
           credentialsRequired: false,
            getToken: function fromHeaderOrQuerystring(req:Request) {
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                } else if (req.query && req.query.token) {
                    return req.query.token;
                }
                return null;
            },
            audience: 'wTqZC92ef4HThbA8muZsA8LI66ddYji3',
            issuer: "https://topeysoft.auth0.com/",
            algorithms: ['HS256']
        }));
        // app.use(checkJwt);
    }

}