import { NextFunction, Request, Response, Router } from 'express';
import { RepoQueryParams } from "./repository";
import { Repository } from './repository';
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from 'http-status-codes';
import { ProjectModel } from '../models/project.model';
import { ObjectID } from 'mongodb';
export class ProjectRepository {
  public prepareQueryParams(req: Request) {
    var queryParams: { skip: number, limit: number, fields: string } = req.query;
    var skip = queryParams.skip || 0;
    var limit = queryParams.limit || 1000;
    skip = parseInt(skip + '');
    limit = parseInt(limit + '');
    var fields = Repository.parseFields(queryParams.fields);
    return { skip: skip, limit: limit, fields: fields };
  }

  public getMany(name: string, queryParams: RepoQueryParams | any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Repository.getMany(name, queryParams).then((data) => {
        resolve(data)
      })
        .catch((err) => {
          console.log(err);
          reject('Request was not understood');
        });
    });
  }
  public getOne(name: string, queryParams: RepoQueryParams | any): Promise<any> {
    return new Promise((resolve, reject) => {
      Repository.getOne(name, queryParams.filter, queryParams.fields)
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          console.log(err);
          reject('Request was not understood');
        });
    });

  }

  public getOneById(name: string, data_id: string, queryParams: RepoQueryParams | any): Promise<any> {
    return new Promise((resolve, reject) => {
      var id = data_id;
      try {
        queryParams.filter = {
          _id: Repository.validateObjectId(data_id)
        };
      } catch (e) {
        reject(e.message);
      }
      Repository.getOne(name, queryParams.filter, queryParams.fields)
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          console.log(err);
          reject('Request was not understood');
        });
    });

  }
  public create(name: string, doc: any) {
    return new Promise((resolve, reject) => {
      Repository.insertOne(name, doc).then((inserted) => {
        resolve(doc);
      })
        .catch((err) => {
          console.log(err);
          reject('Request was not understood');
        });
    });
  }
  public updateById(name: string, id: string, update: any) {
    return new Promise((resolve, reject) => {
      var filter: any = {_id:'fake'};
      try {
        filter = {
          _id: Repository.validateObjectId(id)
        };
      } catch (e) {
        reject(e.message);
      }
      if (!update) {
        reject('Invalid data');
      }
      Repository.exists(name, filter).then((exists) => {
        if (!exists) {
          reject('Data with this id does not exist');
        }
        Repository.updateOne(name, filter, update, { upsert: false }).then((updated) => {
          Repository.getOne(name, filter)
          .then(data=>resolve(data))
          .catch(data=>resolve(update));
        })
          .catch((err) => {
            console.log(err);
            reject('Request was not understood');
          });
      })
        .catch((err) => {
          console.log(err);
          reject('Data with this id does not exist');
        });
    });
  }
  public patchById(name: string, id: string, data: any) {
    return new Promise((resolve, reject) => {
      var filter: object = null;
      try {
        filter = { _id: Repository.validateObjectId(id) };
      } catch (e) {
        reject(e.message);
      }
      Repository.getOne(name, filter)
        .then((existing) => {
          if (!existing) {
            reject('Project does not exist');
          }
          var update = Object.assign(existing, data);
          Repository.updateOne('projects', filter, existing, { upsert: true }).then((patched) => {
            resolve(existing);
          })
            .catch((err) => {
              console.log(err);
              reject('Request was not understood');
            });
        })
        .catch((err) => {
          console.log(err);
          reject('Data with this id does not exist');
        });
    });
  }
  public deleteById(name: string, id: string) {
    return new Promise((resolve, reject) => {
      var filter: object = null;
      try {
        filter = { _id: Repository.validateObjectId(id) };
      } catch (e) {
        reject(e.message);
      }
      Repository.deleteOne(name, filter).then((result) => {
        resolve(result);
      })
        .catch((err) => {
          console.log(err);
          reject('Request was not understood');
        });
    });
  }



}