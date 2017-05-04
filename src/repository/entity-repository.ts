import { NextFunction, Request, Response, Router } from 'express';
import { Repository } from './repository';
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from 'http-status-codes';
import { ProjectModel } from '../models/project.model';
import { ObjectID } from 'mongodb';
export class EntityRepository{
    
  public getMany(req: Request, res: Response) {
    var queryParams: { skip: number, limit: number } = req.query;
    var skip = queryParams.skip || 0;
    var limit = queryParams.limit || 1000;
    skip = parseInt(skip + '');
    limit = parseInt(limit + '');
    var fields = {};
    var params={skip:skip, limit:limit, fields:fields}
    Repository.getMany('entities', params).then((entities) => {
      res.json(entities);
    })
      .catch((err) => {
        console.log(err);
        res.sendStatus(INTERNAL_SERVER_ERROR);
      });
  }
  public getOne(req: Request, resp: Response) {
    var id = req.params.project_id;
    var filter: any = { _id: this.validateObjectId(id, resp) };

    Repository.getOne('projects', filter).then((entity) => {
      resp.json(entity);
    })
      .catch((err) => {
        console.log(err);
        resp.sendStatus(INTERNAL_SERVER_ERROR);
      })
  }
  public create(req: Request, res: Response) {
    var project: ProjectModel = req.body;
    Repository.insertOne('projects', project).then((inserted) => {
      res.json(inserted);
    })
      .catch((err) => {
        console.log(err);
        res.sendStatus(INTERNAL_SERVER_ERROR);
      })
  }
  public update(req: Request, resp: Response) {
    var project: ProjectModel = req.body;
    var project_id = this.validateObjectId(req.params.project_id, resp);
    if (!project_id || !project) return resp.sendStatus(BAD_REQUEST);
    Repository.exists('projects', { _id: project_id }).then((exists) => {
      if (!exists) {
        return resp.status(BAD_REQUEST).send('Project does not exist');
      }
      Repository.updateOne('projects', { _id: project_id }, project, { upsert: false }).then((updated) => {
        resp.json(updated);
      })
        .catch((err) => {
          console.log(err);
          resp.sendStatus(INTERNAL_SERVER_ERROR);
        });
    })
      .catch((err) => {
        console.log(err);
        return resp.status(BAD_REQUEST).send('Project does not exist');
      });

  }
  public patch(req: Request, resp: Response) {
    var project: ProjectModel = req.body;
    var project_id = this.validateObjectId(req.params['project_id'], resp)
    Repository.getOne('projects', { _id: project_id })
      .then((existing) => {
        if (!existing) {
          return resp.status(BAD_REQUEST).send('Project does not exist');
        }
        var update = Object.assign(existing, project);
        console.log('EXisting', existing);
        console.log('Update', update);
        Repository.updateOne('projects', { _id: project_id }, existing, { upsert: true }).then((patched) => {
          resp.json(patched);
        })
          .catch((err) => {
            console.log(err);
            resp.sendStatus(INTERNAL_SERVER_ERROR);
          });
      }).catch((err) => {
        console.log(err);
        resp.sendStatus(INTERNAL_SERVER_ERROR);
      });

  }
  public delete(req: Request, resp: Response) {
    var id =this.validateObjectId(req.params['project_id'], resp);
    Repository.deleteOne("projects", { _id: id }).then((result) => {
      resp.json(result);
    })
      .catch((err) => {
        console.log(err);
        resp.sendStatus(500);
      });
  }


  private validateObjectId(id: string, resp: Response): ObjectID | any {
    var object_id: ObjectID = null;
    try {
      object_id = new ObjectID(id);
    } catch (e) {
      console.log('Unable to parse object id', e);
      return resp.sendStatus(BAD_REQUEST);
    }
    return object_id;
  }
}