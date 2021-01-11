const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const request = require('supertest');
const mongoose = require('mongoose');

describe('/api/genres' , () => {
    let server ;
    beforeEach(() => { server = require('../../index') });
    afterEach(async () => { 
        server.close(),
        await Genre.deleteMany({});
    });

    describe('GET /' , () => {
        it('should return all genres' , async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1' )).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2' )).toBeTruthy();
        });
    });

    describe('GET /:id' , () => {
        it('should return 404 if ID is Invalid' , async () => {
            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404);
        });

        it('should return genre with given ID' , async () => {
            const genre = await Genre.create({ name: 'genre' });
            const res = await request(server).get(`/api/genres/${genre._id}`);
            // console.log(res);
            expect(res.body._id).toBe(genre.id);
            expect(res.body.name).toBe(genre.name);
            expect(res.body).toHaveProperty('name' , genre.name);
        });
        
        it('should return 404 if no genre with given ID' , async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${id}`);
            // console.log(res);
            
            expect(res.status).toBe(404);
        });
    });

    describe('POST /' , () => {
        let token;
        let name;

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre';   
        });

        const exec = async () => {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token' , token)
            .send({ name });
        }

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre name is less than 5 or more than 50 charachters', async() => {
            name = 'aaa';
            const res1 = await exec();

            name = new Array(52).join('a');
            const res2 = await exec();

            expect(res1.status).toBe(400);
            expect(res2.status).toBe(400);
        });

        it('should save genre if it is valid', async() => {
            await exec()
            const genre = await Genre.find({ name: 'genre'});
            expect(genre).not.toBeNull();
        });

        it('should return genre if it is valid', async() => {            
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name' , 'genre');
        });
    });

    describe('PUT /:id' , () => {

        let genre;
        let newName;
        beforeEach(async () => {
            newName = 'new genre'
            genre = new Genre({ name: newName });
            await genre.save();
        });

        afterEach(async () => {
            await Genre.deleteMany({});
        });

        const exec = async () => {
            return  await request(server)
                        .put(`/api/genres/${genre._id}`)
                        .send({ name: newName });
        }
        
        it('should return 400 if genre name is less than 5 or more the 50 charchters' , async () => {
            newName = 'a';
            let res = await exec();
            expect(res.status).toBe(400);

            newName = new Array(52).join('a');
            res = await exec();
            expect(res.status).toBe(400);

        });

        it('should return 404 if genre ID is invalid' , async () => {
            genre._id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return the updated genre' , async () => {
            const res = await exec();
            expect(res.body.name).toBe(newName);
        });
    });

    describe('DELETE /:id' , () => {
        let genre;
        let token;
        let isAdmin;
        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();
            genre = new Genre({ name: 'genre' });
            await genre.save()
        })

        const exec = () => {
            return request(server)
                    .delete(`/api/genres/${genre._id}`)
                    .set('x-auth-token' ,token)
        }
        
        it('should return 401 if user is not logged id' , async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        
        it('should return 403 if user is not admin' , async () => {
            token = new User({ isAdmin: false }).generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });

        it('should return 404 if genre with given ID is not found' , async () => {
            genre._id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
        
        it('should return the deleted genre' , async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id' , genre._id.toHexString());
        });
        
    });
})