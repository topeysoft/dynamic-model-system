import { Repository } from '../repository/repository';
export class SchemaManager{
     getProjectById(id:string){
        return Repository.getOne("projects")
     }
}