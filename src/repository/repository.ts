import { MongoClient, MongoError, Db, InsertOneWriteOpResult, InsertWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject, FindOneOptions, ObjectID, Collection } from 'mongodb';
import { sanitizeModelName } from '../sanitizers/name.sanitizer';
const shortid =require('shortid');
export class Repository {
    /**
     *
     */
    // constructor(connectionUrl) {
    //     Repository.init(connectionUrl);
    // }
    private static _repo: Repository;
    private static _db: Db;
    static initialize(connectionUrl: string, force: boolean = false) {
        if (!Repository._db || force) {
            MongoClient.connect(connectionUrl, (err: MongoError, database: Db) => {
                if (err) return console.error("MongoDB Connection error:", err.message);
                Repository._db = database;
            });
        }
    }

    /**
     *
     */

    public static getOne<T>(collectionName: string, query: object = {}, fields: any = {}): Promise<T> {
        var options: FindOneOptions = {};
        options.fields = fields;
        return Repository._db.collection(collectionName).findOne(query, options);
    }
    public static getMany<T>(collectionName: string, queryParams: RepoQueryParams | any): Promise<T[]> {
        return Repository._db.collection(collectionName).find(queryParams.query, queryParams.fields, queryParams.skip, queryParams.limit).toArray();
    }
    public static insertOne<T>(collectionName: string, doc: T | any, setDate: boolean = true): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!doc) reject('Invalid data');
            if (setDate) {
                doc['created'] = new Date();
                doc['modified'] = new Date();
            }
            var collection: Collection = Repository._db.collection(collectionName);
            collection.createIndex({ "name": 1 }, { unique: true });
            if (doc.name) {
                doc.raw_name = doc.name;
                doc.name = sanitizeModelName(doc.name);
            } else {
                doc.name = shortid.generate();
            }

            try {
                collection.insertOne(doc).then(result => {
                    resolve(result);
                })
                    .catch(err => {
                        var defaultMessage = 'Invalid model';
                        var message = err.message.indexOf('name_1 dup key') !== -1 ? 'Name must be unique' : defaultMessage;
                        ; reject(message);
                    })
            } catch (error) {
                reject(error);
            }
        });
    }
    public static insertMany<T>(collectionName: string, docs: T[]): Promise<InsertWriteOpResult> {
        return Repository._db.collection(collectionName).insertMany(docs);
    }

    public static updateOne<T>(collectionName: string, filter: {}, doc: T | any, options = {}, setDate = true): Promise<UpdateWriteOpResult> {
        var update: Object | any = {};
        if (doc._id) delete doc._id;
        update = doc;
        // if (doc && doc.name) {
        //     doc.raw_name = doc.name;
        //     doc.name = sanitizeModelName(doc.name);
        // }
        if (setDate) update['modified'] = new Date();
        return Repository._db.collection(collectionName).updateOne(filter, update, options);
    }
    public static updateOneSub<T>(collectionName: string, filter: {}, doc: T, options = {}, action = '$set', setDate = true): Promise<UpdateWriteOpResult> {
        var update: Object | any = {};
        update.action = doc;
        //if(setDate) update['$currentDate']= { lastModified: true };
        return Repository._db.collection(collectionName).updateOne(filter, update, options);
    }
    // public static updateOneSubDoc(collectionName: string, filter, subDoc, options={}): Promise<UpdateWriteOpResult> {
    //   var update = {
    //         $push:subDoc,
    //     }
    //     return Repository._db.collection(collectionName).updateOne(filter, update, options);
    // }
    public static updateMany<T>(collectionName: string, filter: object, doc: T, options = {}): Promise<UpdateWriteOpResult> {
        return Repository._db.collection(collectionName).updateMany(filter, doc, options);
    }

    public static deleteOne<T>(collectionName: string, filter: {}): Promise<DeleteWriteOpResultObject> {
        return Repository._db.collection(collectionName).deleteOne(filter);
    }
    public static deleteMany<T>(collectionName: string, filter: {}): Promise<DeleteWriteOpResultObject> {
        return Repository._db.collection(collectionName).deleteMany(filter);
    }
    public static exists<T>(collectionName: string, filter: {}): Promise<boolean> {
        return new Promise<boolean>((resolve: (v: boolean) => {}, reject) => {
            Repository._db.collection(collectionName).count(filter)
                .then((count) => resolve(count > 0))
                .catch((error) => reject(error));
        });
    }


    public static validateObjectId(id: string): ObjectID | any {
        var object_id: ObjectID = null;
        try {
            object_id = new ObjectID(id);
        } catch (e) {
            console.log('Unable to parse object id', e.message);
            throw new Error('Invalid id');
        }
        return object_id;
    }
    public static parseFields(fields: string): Object {
        var fieldsObject: any = {};
        if (fields) {
            var fieldsArray = fields.split(',');
            fieldsArray.forEach((f) => {
                fieldsObject[f] = true;
            });
        }
        return fieldsObject;
    }
}

export class RepoQueryParams {
    query: any = {};
    fields: any = {};
    skip: number = 0;
    limit: number = 1000;
}