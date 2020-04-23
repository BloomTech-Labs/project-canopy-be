const request = require('supertest');
const server = require('../server.js');

describe('data_routes', function(){
    it("should run the tests", function() {
        expect(true).toBe(true);
      });

    describe('GET /api/data/by/country', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/data/by/country')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
        it('res.body.length should be 6', function(){
            return request(server)
                .get('/api/data/by/country')
                .then(res => {
                    expect(res.body.length).toBe(6)
                })
        });
    });

    describe('GET /api/data/by/all', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/data/by/all')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
        it('res.body.length should be 4', function(){
            return request(server)
                .get('/api/data/by/all')
                .then(res => {
                    expect(res.body.classes.length).toBe(4)
                })
        });
    });

    describe('GET /api/data/by/habitat', function(){
        it('should return 200 status', function(){
            return request(server)
                .get('/api/data/by/habitat')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        });
        it('res.body.length should be 15', function(){
            return request(server)
                .get('/api/data/by/habitat')
                .then(res => {
                    expect(res.body.length).toBe(15)
                })
        });
    });




    // describe('GET /th_s/classCount', function(){
    //     it('should return 200 status', function(){
    //         return request(server)
    //             .get('/th_s/classCount')
    //             .then(res => {
    //                 expect(res.status).toBe(200)
    //             })
    //     });
    //     it('res.body.threatenedCounts should be 4', function(){
    //         return request(server)
    //             .get('/th_s/classCount')
    //             .then(res => {
    //                 expect(res.body.threatenedCounts.length).toBe(4)
    //             })
    //     });
    //     it('total count of threat levels should equal the threatenedCount', function(){
    //         return request(server)
    //             .get('/th_s/classCount')
    //             .then(res => {
    //                 const obj = res.body.threatenedCounts[0]
    //                 const totalThreatened = obj.threatenedCount;
    //                 const threatLevels = obj.threatLevels.map(threat => {
    //                     return threat.count
    //                 })
    //                 const threatSums = threatLevels.reduce((a, b) => {
    //                     return a + b
    //                 }, 0)
    //                 expect(threatSums).toBe(totalThreatened)
    //             })
    //     });
    //     it('res.body.allSpeciesCounts should be 4', function(){
    //         return request(server)
    //             .get('/th_s/classCount')
    //             .then(res => {
    //                 expect(res.body.allSpeciesCounts.length).toBe(4)
    //             })
    //     });
    // });
});