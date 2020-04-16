const request = require('supertest');
const server = require('../server.js');

describe('threatened_species router', function(){
    it("should run the tests", function() {
        expect(true).toBe(true);
      });
    
    describe('GET /api/species/by/country', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/species/by/country')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
    })

    describe('GET /api/species/by/habitat', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/species/by/habitat')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
    })

    describe('GET /api/species/by/class', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/species/by/class')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
    })
})