# Dynamic Model System (a BaaS system)
Dynamic Model System, Backend as a Service.

### Features
- Supports schemaless model
- Supports all CRUD operations 
- RESTful API implementation
- Supports JWT authentication 
- Supports (granular) persmission oriented authorization (ex. read:users, edit:notes, delete:pages, create:tasks, etc.
- Supports field selection (projection) (ex. GET api/notes/123?fields=name,date ... , etc)
- Supports pagination  (ex. GET api/notes/123?skip=2&limit20 )

#### Features that will be added later 
- BYOA (Bring Your Own Authentication), suitable for using third party authentication system like auth0
- Management UI
- Support querying by object (ex. GET api/notes/?query={"name":"joe"}, etc)
