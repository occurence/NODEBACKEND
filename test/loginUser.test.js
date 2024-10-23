import bcrypt from 'bcryptjs';
import { jest } from '@jest/globals';
import request from 'supertest';
import { User } from '../models/usersModel.js';
import { app } from '../app.js';
import jwt from 'jsonwebtoken';

describe('Test @POST /api/users/login', () => {
    const mockSignInData = {
        email: "test01@gmail.com",
        password: "Password01",
    }

    const mockUserId = "mockUserId";
    let mockUserAccount;

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash(mockSignInData.password, 10);

        mockUserAccount = {
            _id: mockUserId,
            email: mockSignInData.email,
            password: hashedPassword,
            subscription: 'starter',
        };
        console.log(`ID: ${mockUserAccount._id} Email: ${mockUserAccount.email} Password: ${mockUserAccount.password}`);
        jest
        .spyOn(User, 'findOne')
        .mockImplementation(({ email }) => {
            if(email === mockSignInData.email) {return Promise.resolve(mockUserAccount);}
            return Promise.resolve(null);
        });

        jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((password, hashedPassword) => {
            return Promise.resolve(
                password === mockSignInData.password &&
                hashedPassword === mockUserAccount.password
            );
        });
        console.log(`Password: ${mockSignInData.password} Hashed: ${mockUserAccount.password}`);
        jest
        .spyOn(jwt, 'sign')
        .mockImplementation(() => 'mockJwtToken');

        jest
        .spyOn(User, 'findByIdAndUpdate')
        .mockImplementation((id, object) => {
            if(id === mockUserId){
                return Promise.resolve({
                    ...mockSignInData, ...object
                });console.log(`mock: ${mockSignInData} object: ${object}`);
            }
            return Promise.resolve(null);
        });
    });
    
    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('Login POST request with correct data', async () => {
        const res = await request(app).post('/api/users/login').send(mockSignInData);

        console.log("Login Data:", mockSignInData);
        console.log("Response status code:", res.status);
        console.log("Response body:", res.body);
        console.log("Response body USER:", res.body.user);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token', 'mockJwtToken');
        const { user } = res.body;
        console.log(`User where: ${user}`);
    });
});