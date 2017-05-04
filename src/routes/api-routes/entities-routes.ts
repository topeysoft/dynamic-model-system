import { NextFunction, Request, Response, Router } from 'express';
import { ObjectID } from 'mongodb';
import { Repository } from '../../repository/repository';
import { EntityModel, EntitySchemaModel } from '../../models/entity.model';
import { ProjectRepository } from '../../repository/project-repository';
import { OK, BAD_REQUEST, CREATED, UNAUTHORIZED } from 'http-status-codes';
import { ApiRouteConstants } from './api-route-constants';
import { ProjectModel } from '../../models/project.model';
import { sanitizeModelName } from '../../sanitizers/name.sanitizer';
import { permissions, checkPermissions } from '../../middlewares/security/authorize-permission';
export class EntitiesApiRoutes {

  private basePath: string = '';
  private repository: ProjectRepository;
  private patterns = ApiRouteConstants.url.entities.patterns;

  constructor(private router: Router) {
    this.repository = new ProjectRepository();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }
  private postRoutes() {
    this.router.post(`${this.basePath}${this.patterns.post}`, (req, res) => {
      var permissions = ['create:*', `create:${req.params['entity_name']}`];
      checkPermissions(req, permissions).then(result => {
        this.getEntityData(req).then(entityData => {
          var entity: EntityModel = req.body;
          entity.project_id = entityData.project_id;
          this.repository.create(this.buildModelNameFromData(entityData), entity)
            .then(result => {
              return res.status(CREATED).send(result);
            })
            .catch(e => {
              return res.status(BAD_REQUEST).send(e);
            });

        }).catch(err => {
          return res.sendStatus(BAD_REQUEST);
        });
      })
        .catch(err => {
          res.sendStatus(UNAUTHORIZED);
        })
    });
  }
  private putRoutes() {
    this.router.put(`${this.basePath}${this.patterns.put}`, (req, res) => {
      var permissions = ['edit:*', `edit:${req.params['entity_name']}`];
      checkPermissions(req, permissions).then(result => {
        this.getEntityData(req).then(entityData => {
          var entity: EntityModel = req.body;
          entity.project_id = entityData.project_id;
          this.repository.updateById(this.buildModelNameFromData(entityData), req.params['entity_id'], entity)
            .then(result => {
              res.status(OK).send(result);
            })
            .catch(e => {
              res.status(BAD_REQUEST).send(e);
            });
        }).catch(e => {
          res.sendStatus(BAD_REQUEST);
        });
      })
        .catch(err => {
          res.sendStatus(UNAUTHORIZED);
        })
    });
  }
  private patchRoutes() {
    this.router.patch(`${this.basePath}e${this.patterns.patch}`, (req, res) => {
      var permissions = ['edit:*', `edit:${req.params['entity_name']}`];
      checkPermissions(req, permissions).then(result => {
        this.getEntityData(req).then(entityData => {
          this.repository.patchById(this.buildModelNameFromData(entityData), req.params['entity_id'], req.body)
            .then(result => {
              res.status(OK).send(result);
            })
            .catch(e => {
              res.status(BAD_REQUEST).send(e);
            });
        }).catch(e => {
          res.sendStatus(BAD_REQUEST);
        });
      })
        .catch(err => {
          res.sendStatus(UNAUTHORIZED);
        })
    });
  }
  private deleteRoutes() {
    this.router.delete(`${this.basePath}${this.patterns.delete}`, (req, res) => {
      var permissions = ['delete:*', `delete:${req.params['entity_name']}`];
      checkPermissions(req, permissions).then(result => {
        this.getEntityData(req).then(entityData => {
          this.repository.deleteById(this.buildModelNameFromData(entityData), req.params['entity_id'])
            .then(result => {
              res.status(OK).send(result);
            })
            .catch(e => {
              res.status(BAD_REQUEST).send(e);
            });
        }).catch(e => {
          res.sendStatus(BAD_REQUEST);
        });
      })
        .catch(err => {
          res.sendStatus(UNAUTHORIZED);
        })
    });
  }
  private getRoutes() {
    this.router.get(`${this.basePath}${this.patterns.get_many}`, (req, res) => {
      var permissions = ['read:*', `read:${req.params['entity_name']}`];
      checkPermissions(req, permissions).then(result => {
        this.getEntityData(req).then(entityData => {
          var params: any = this.repository.prepareQueryParams(req);
          params.query = {};
          this.repository.getMany(this.buildModelNameFromData(entityData), params)
            .then(projects => {
              res.status(OK).json(projects);
            }).catch(err => {
              res.status(BAD_REQUEST).status(err)
            })
        }).catch(err => {
          res.sendStatus(BAD_REQUEST);
        });
      })
        .catch(err => {
          res.sendStatus(UNAUTHORIZED);
        });

    });

    this.router.get(`${this.basePath}${this.patterns.get_one}`, (req, res) => {
      var permissions = ['read:*', `read:${req.params['entity_name']}`];
      checkPermissions(req, permissions).then(result => {
        this.getEntityData(req).then(entityData => {
          var params = this.repository.prepareQueryParams(req);
          this.repository.getOneById(this.buildModelNameFromData(entityData), req.params['entity_id'], params)
            .then(data => {
              res.status(OK).json(data);
            })
            .catch(e => {
              res.status(BAD_REQUEST).send(e);
            })
        }).catch(err => {
          res.sendStatus(BAD_REQUEST);
        });
      })
        .catch(err => {
          res.sendStatus(UNAUTHORIZED);
        })
    });
  }

  private getEntityData(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        var project_id = req.params.project_id;
        var entity_name = req.params.entity_name;
        var projectQuery: any = { $or: [{ name: project_id }] };
        try {
          projectQuery.$or.push({ _id: new ObjectID(project_id) });
        } catch (error) { }

        var entityQuery: any = { $or: [{ "entities.name": entity_name }] };
        try {
          entityQuery.$or.push({ "entities._id": new ObjectID(entity_name) });
        } catch (error) { }

        var query: any = { $and: [projectQuery, entityQuery] };
        Repository.getOne<ProjectModel>('projects', query, {})
          .then(project => {
            try {
              var data = project.entities.find((entity) => {
                return entity.name === sanitizeModelName(entity_name);
              });
              data.project_id = data.project_id || project._id;
              resolve(data);
            } catch (error) {
              reject(error);
            }

          }).catch(err => {
            reject(err);
          })
      } catch (error) {
        reject(error);
      }
    })

  }

  private buildModelNameFromData(data: EntitySchemaModel) {
    return `${data.project_id}_${data.name}`;
  }
}

