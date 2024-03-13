const { connectToServer } = require('./utils/db');
const mongoose = require('mongoose');

describe('connectToServer', () => {
    beforeAll(async () => {
        await connectToServer();
    });

    it('successfully connects to the database', () => {
        const db = mongoose.connection;
        expect(db.readyState).toBe(1); // 1 = connected
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
