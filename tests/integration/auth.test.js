const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');


describe('auth middleware' , () => {
    let server, token;
    beforeEach(() => {
        server = require('../../index'),
        token = new User().generateAuthToken();
    });
    afterEach(async () => { 
        server.close(),
        await Genre.deleteMany({});
    });
    
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token' , token)
            .send({ name: 'genre'});
    }

    it('should return 401 if no token is provided' , async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid' , async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid' , async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });


})