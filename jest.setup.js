jest.setTimeout(30000);
// provide defaults for environment variables used in tests
process.env.ENCRYPTION_PASSWORD = process.env.ENCRYPTION_PASSWORD || 'testpassword';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';