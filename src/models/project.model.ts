import { BaseModel } from './base.model';
import { EntityModel, EntitySchemaModel } from './entity.model';
export class ProjectModel extends BaseModel{
    entities:EntitySchemaModel[];
}