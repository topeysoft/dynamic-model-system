import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./base-route";

export class IndexRoute extends BaseRoute {
  public static create(router: Router) {
    console.log("[IndexRoute::create] Creating index route.");

    router.get("/", (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().index(req, res, next);
    });
  }

  constructor() {
    super();
  }

 
  public index(req: Request, res: Response, next: NextFunction) {
    this.title = "Home | Tour of Heros";

    let options: Object = {
      "message": "Welcome to the Tour of Heros"
    };

    this.render(req, res, "index", options);
  }
}