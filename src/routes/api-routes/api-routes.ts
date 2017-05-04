import { NextFunction, Router, Request, Response, Express } from 'express';
import { ProjectApiRoutes } from './projects-routes';
import { EntitiesApiRoutes } from './entities-routes';
import { Authorize } from '../../middlewares/security/authorize';
export class ApiRoutes { 
    constructor(app:Express, basePath: string = '/api') {
        var router = Router();
        router.get('/', function (req: Request, res: Response) {
            res.json({ message: 'Welcome to our api!' });
        });
        new Authorize(app);
        new ProjectApiRoutes(router);
        new EntitiesApiRoutes(router);
        app.use(basePath,router);
    }
    
}