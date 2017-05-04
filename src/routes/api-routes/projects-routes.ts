import { NextFunction, Request, Response, Router } from 'express';
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED, UNAUTHORIZED } from 'http-status-codes';
import { ObjectID } from 'mongodb';
import { Repository } from '../../repository/repository';
import { ProjectModel } from '../../models/project.model';
import { ProjectRepository } from '../../repository/project-repository';
import { ApiRouteConstants } from './api-route-constants';
import { permissions, checkPermissions } from '../../middlewares/security/authorize-permission';
export class ProjectApiRoutes {

  private basePath: string = '';
  private repository: ProjectRepository;
  private patterns = ApiRouteConstants.url.projects.patterns;
  constructor(private router: Router) {
    this.repository = new ProjectRepository();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  private getRoutes() {
    this.router.get(`${this.basePath}${this.patterns.get_many}`, (req, res) => {
      this.getProjectData(req).then(projectData => {
        var permissions = [ `read:${projectData.name}|${projectData._id}`
          , `*:${projectData.name}|${projectData._id}`];
        checkPermissions(req, permissions).then(result => {
          var params: any = this.repository.prepareQueryParams(req);
          params.query = {};
          this.repository.getMany('projects', params)
            .then(projects => {
              res.status(OK).json(projects);
            }).catch(err => {
              res.status(BAD_REQUEST).status(err);
            });
        })
          .catch(e => {
            res.sendStatus(UNAUTHORIZED);
          });
      }).catch(e => {
        res.sendStatus(BAD_REQUEST);
      });

    });
    this.router.get(`${this.basePath}${this.patterns.get_one}`, (req, res) => {
      this.getProjectData(req).then(projectData => {
        var permissions = [ `read:${projectData.name}|${projectData._id}`
          , `*:${projectData.name}|${projectData._id}`];
        checkPermissions(req, permissions).then(result => {
          var params = this.repository.prepareQueryParams(req);
          console.log(params);
          this.repository.getOneById('projects', req.params['project_id'], params)
            .then(data => {
              res.status(OK).json(data);
            })
            .catch(e => {
              res.status(BAD_REQUEST).send(e);
            });
        })
          .catch(e => {
            res.sendStatus(UNAUTHORIZED);
          });
      }).catch(e => {
        res.sendStatus(BAD_REQUEST);
      });

    });
  }

  private postRoutes() {
    this.router.post(`${this.basePath}${this.patterns.post}`, (req, res) => {
      this.getProjectData(req).then(projectData => {
        var permissions = [`create:${projectData.name}|${projectData._id}`
          , `*:${projectData.name}|${projectData._id}`];
        checkPermissions(req, permissions).then(result => {
          var project: ProjectModel = req.body;
          this.repository.create('projects', project)
            .then(result => {
              res.status(CREATED).send(result);
            })
            .catch(e => {
              res.status(BAD_REQUEST).send(e);
            });
        })
          .catch(e => {
            res.sendStatus(UNAUTHORIZED);
          });
      }).catch(e => {
        res.sendStatus(BAD_REQUEST);
      });
    });
  }
  private putRoutes() {
    this.router.put(`${this.basePath}${this.patterns.put}`, (req, res) => {
      this.getProjectData(req).then(projectData => {
        var permissions = [`edit:${projectData.name}|${projectData._id}`
          , `*:${projectData.name}|${projectData._id}`];
        checkPermissions(req, permissions).then(result => {
          var project: ProjectModel = req.body;
          this.repository.updateById('projects', req.params['project_id'], project)
            .then(result => {
              res.status(OK).send(result);
            })
            .catch(e => {
              res.status(BAD_REQUEST).send(e);
            });
        }).catch(e => {
          res.sendStatus(UNAUTHORIZED);
        });
      }).catch(e => {
        res.sendStatus(BAD_REQUEST);
      });
    });
  }
  private patchRoutes() {
    this.router.patch(`${this.basePath}${this.patterns.patch}`, (req, res) => {
      this.getProjectData(req).then(projectData => {
        var permissions = [`edit:${projectData.name}|${projectData._id}`
          , `*:${projectData.name}|${projectData._id}`];
        checkPermissions(req, permissions).then(result => {
          this.repository.patchById('projects', req.params['project_id'], req.body)
            .then(result => {
              res.status(OK).send(result);
            })
            .catch(e => {
              res.status(BAD_REQUEST).send(e);
            });
        }).catch(e => {
          res.sendStatus(UNAUTHORIZED);
        });
      }).catch(e => {
        res.sendStatus(BAD_REQUEST);
      });
    });
  }
  private deleteRoutes() {
    this.router.delete(`${this.basePath}${this.patterns.delete}`, (req, res) => {
      this.getProjectData(req).then(projectData => {
        var permissions = [`delete:${projectData.name}|${projectData._id}|${projectData._id}`
          , `*:${projectData.name}|${projectData._id}`];
        checkPermissions(req, permissions).then(result => {
          this.repository.deleteById('projects', req.params['project_id'])
            .then(result => {
              res.status(OK).send(result);
            })
            .catch(e => {
              res.status(BAD_REQUEST).send(e);
            });
        }).catch(e => {
          res.sendStatus(UNAUTHORIZED);
        });
      }).catch(e => {
        res.sendStatus(BAD_REQUEST);
      });
    });
  }


  private getProjectData(req: Request) {
    return this.repository.getOneById('projects', req.params['project_id'], {});
  }

}

