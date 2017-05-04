export const DevConfig:any={
    cors:{
        allowed_origins:[
            'localhost:8100'
        ,'localhost:4200'
        ,'http://localhost:8100'
        ,'http://localhost:4200'
        ,'topeysoft.smart.local:8100'
        ,'http://topeysoft.smart.local:8100'
        ]
        , allowed_methods:'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        , allowed_headers:'X-Requested-With,content-type,Authorization'
        , allow_credentials:'false'

    },
    request:{
        size_limit:'50mb'
    },
    mongodb:{
        connection_url:"mongodb://127.0.0.1:27017/dynamic"
    }
}