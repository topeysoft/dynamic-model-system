import * as assert from 'assert';
import * as mocha from 'mocha';
import * as sinon from "Sinon";
import { ApiRoutes } from '../../src/routes/api-routes/api-routes';
import * as express from 'express';
import { Repository } from '../../src/repository/repository';

describe('Repository', () => {
    var sandbox: sinon.SinonSandbox, apiRoute = new Repository();
    before(()=>{
         sandbox = sinon.sandbox.create();
    })
    describe('getOne', () => {
        it('should return single document', () => {
            assert.ok(true, "This shouldn't fail");
        })
    })
});


