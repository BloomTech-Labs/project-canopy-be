const request = require('supertest');
const server = require('../server.js');

describe('data_routes', function(){
    it("should run the tests", function() {
        expect(true).toBe(true);
      });

    describe('GET /api/biodiversity/', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/biodiversity/')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
        it('res.body.length should be > 0', function(){
            return request(server)
                .get('/api/biodiversity/')
                .then(res => {
                    expect(res.body.length).not.toBe(0)
                })
        });
    });

    describe('GET /api/biodiversity/:country', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/biodiversity/Cameroon')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
        it('res.body.length should be > 0', function(){
            return request(server)
                .get('/api/biodiversity/Cameroon')
                .then(res => {
                    expect(res.body.length).not.toBe(0)
                })
        });
    });

    describe('GET /api/threats', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/threats/')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
        it('res.body.length should be > 0', function(){
            return request(server)
                .get('/api/threats/')
                .then(res => {
                    expect(res.body.length).not.toBe(0)
                })
        });
    });

    describe('GET /api/threats/:habitat_code', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/threats/1.5')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
        it('res.body.length should be > 0', function(){
            return request(server)
                .get('/api/threats/1.5')
                .then(res => {
                    expect(res.body.length).not.toBe(0)
                })
        });
    });

    describe('GET /api/threats/country/:country', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/threats/country/Cameroon')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
        it('res.body.length should be > 0', function(){
            return request(server)
                .get('/api/threats/country/Cameroon')
                .then(res => {
                    expect(res.body.length).not.toBe(0)
                })
        });
    });
});