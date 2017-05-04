import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import { Response, NextFunction, Router, Express } from 'express';
import * as express from 'express';
import { ApiRoutes } from './routes/api-routes/api-routes';
import { ConfigManager } from './configs/config-manager';
import { CorsFilterMiddleware } from './middlewares/request-headers/cors-filter.middleware';
import { IndexRoute } from './routes/index';
import { Repository } from './repository/repository';

export class Server {
    requestSizeLimit: any;
    config: any;
    public static bootstrap(): Server {
        return new Server();
    }
    constructor() {
        this.config=ConfigManager.getConfig()
        this.config.request=this.config.request||{};
        this.requestSizeLimit=this.config.request.size_limit ||'1mb';
        this.app = express();
        this.configure();
        this.routes();
        this.api();
        this.initializeRepository();
    }
    public app: Express;


    private configure() {
        this.setupHeaders();
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");
        this.app.use(logger("dev"));

        this.app.use(bodyParser.json({ limit: this.requestSizeLimit}));
        this.app.use(bodyParser.urlencoded({ limit: this.requestSizeLimit, extended: true }));
        this.app.use(cookieParser("super-strong-secret-dc0649f7-e9b9-4133-8e2e-6f4677bb3492"));
        this.app.use(methodOverride());
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
        this.app.use((req, res, next) => {
            next()
        });
    }
    public routes() {
        let router: Router;
        router = Router();
        IndexRoute.create(router);
        this.app.use(router);
        new ApiRoutes(this.app);

    }
    public api() {

    }
    public setupHeaders() {
        new CorsFilterMiddleware(this.app);
    }
    private initializeRepository() {
        var config = ConfigManager.getConfig();
        Repository.initialize(config.mongodb.connection_url)
    }
}