const mongoose = require('mongoose');
const auth = require('../../../middleware/auth');
const { User } = require('../../../models/user')


describe('auth middleware' , () => {


    it('should populate req.user with payload of valid jwt', () => {
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {};
        const next = jest.fn();

        
        auth(req, res, next);
        expect(req.user).toMatchObject(user);
    })
})