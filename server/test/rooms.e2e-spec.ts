import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Worker } from 'mediasoup/node/lib/Worker';
import { AppModule } from '../src/app.module';
import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('RoomsController (e2e) unauthorized', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Worker)
      .useClass(jest.fn())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1/rooms (POST) unauthorized', () => {
    return request(app.getHttpServer())
      .post('/api/v1/rooms')
      .expect(HttpStatus.UNAUTHORIZED);
  });
});

describe('RoomsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    class MockJwtAuthGuard {
      canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        request.user = {
          id: request.headers['x-user'] || '1',
          roles: [],
        };
        return true;
      }
    }
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Worker)
      .useClass(jest.fn())
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/api/v1/rooms (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/rooms')
      .send({ name: 'test' })
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body.name).toBe('test');
        expect(response.body.slug).toBeDefined();
        expect(response.body.id).toBeDefined();
      });
  });

  it('/api/v1/rooms (GET)', async () => {
    const agent = request(app.getHttpServer());
    let response = await agent
      .post('/api/v1/rooms')
      .send({ name: 'test' })
      .expect(HttpStatus.CREATED);
    expect(response.body.name).toBe('test');
    expect(response.body.slug).toBeDefined();
    expect(response.body.id).toBeDefined();
    response = await agent.get('/api/v1/rooms').expect(HttpStatus.OK);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('/api/v1/rooms/:id (GET)', async () => {
    const agent = request(app.getHttpServer());
    let response = await agent
      .post('/api/v1/rooms')
      .send({ name: 'test' })
      .expect(HttpStatus.CREATED);
    const roomId = response.body.id;
    const roomSlug = response.body.slug;
    response = await agent
      .get(`/api/v1/rooms/${roomSlug}`)
      .expect(HttpStatus.OK);
    expect(response.body.id).toBe(roomId);
  });

  it('/api/v1/rooms/:id (PATCH)', async () => {
    const agent = request(app.getHttpServer());
    let response = await agent
      .post('/api/v1/rooms')
      .send({ name: 'test' })
      .expect(HttpStatus.CREATED);
    const roomId = response.body.id;
    const roomSlug = response.body.slug;
    response = await agent
      .patch(`/api/v1/rooms/${roomSlug}`)
      .send({ name: 'test2' })
      .expect(HttpStatus.OK);
    response = await agent
      .get(`/api/v1/rooms/${roomSlug}`)
      .expect(HttpStatus.OK);
    expect(response.body.id).toBe(roomId);
    expect(response.body.name).toBe('test2');
  });
  it('/api/v1/rooms/:id (DELETE)', async () => {
    const agent = request(app.getHttpServer());
    let response = await agent
      .post('/api/v1/rooms')
      .send({ name: 'test' })
      .expect(HttpStatus.CREATED);
    const roomId = response.body.id;
    const roomSlug = response.body.slug;
    response = await agent
      .delete(`/api/v1/rooms/${roomSlug}`)
      .expect(HttpStatus.OK);
    await agent.get(`/api/v1/rooms/${roomId}`).expect(HttpStatus.NOT_FOUND);
  });

  it('/api/v1/rooms/:id/users (POST)', async () => {
    const agent = request(app.getHttpServer());
    let response = await agent
      .post('/api/v1/rooms')
      .send({ name: 'test' })
      .expect(HttpStatus.CREATED);
    const roomSlug = response.body.slug;
    response = await agent
      .post(`/api/v1/rooms/${roomSlug}/users`)
      .set('X-User', '2')
      .expect(HttpStatus.CREATED);
    await agent
      .get(`/api/v1/rooms/${roomSlug}`)
      .set('X-User', '2')
      .expect(HttpStatus.OK);
    await agent
      .delete(`/api/v1/rooms/${roomSlug}`)
      .set('X-User', '2')
      .expect(HttpStatus.FORBIDDEN);
  });
});
