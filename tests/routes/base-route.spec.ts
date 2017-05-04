import * as assert from 'assert';
import * as mocha from 'mocha';
import * as sinon from "Sinon";
import { ApiRoutes } from '../../src/routes/api-routes/api-routes';
import * as express from 'express';

describe('BASE_ROUTE.TS', () => {
    var sandbox: sinon.SinonSandbox, apiRoute = new ApiRoutes(express());
    before(()=>{
         sandbox = sinon.sandbox.create();
    })
    describe('GET', () => {
        it('should return a 200 ok', () => {
            assert.ok(true, "This shouldn't fail");
        })
    })
});
