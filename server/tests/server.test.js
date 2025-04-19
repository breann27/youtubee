// __tests__/server.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

// Optionally, use a test database or in-memory database here.
// For this example, we use the same DB defined in .env

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /', () => {
  it('should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Welcome to the YouTube Clone API!");
  });
});

describe('Auth Endpoints', () => {
  let token;
  const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "Test@123",
    channelName: "Test Channel",
    profilePic: "",
    about: "This is a test user"
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should not register a duplicate user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "Test@123"
      });
    
    expect(res.statusCode).toBe(400);
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Comment Endpoints', () => {
  it('should return an empty array for comments if none exist', async () => {
    const dummyVideoId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/comments/${dummyVideoId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// Additional tests for video upload endpoints can be added here.
// For example, test video upload using .attach() with a dummy file:
// 
// describe('Video Endpoints', () => {
//   it('should upload a video when provided with valid data and token', async () => {
//     const res = await request(app)
//       .post('/api/videos/upload')
//       .set('Authorization', `Bearer ${token}`)
//       .field('title', 'Test Video')
//       .field('description', 'Test Description')
//       .field('category', 'Test Category')
//       .attach('video', 'path/to/dummy/video.mp4'); // ensure this file exists for testing
//     
//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('videoUrl');
//   });
// });
