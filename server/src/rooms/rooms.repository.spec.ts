import { Test, TestingModule } from '@nestjs/testing';
import { RoomRoles } from './room.roles';
import { RoomsRepository } from './rooms.repository';

describe('RoomsRepository', () => {
  let service: RoomsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsRepository],
    }).compile();

    service = module.get<RoomsRepository>(RoomsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create room', () => {
    const room = service.create('test', 'test');
    expect(room).toBeDefined();
    expect(room.id).toBe(1);
    expect(room.name).toBe('test');
    expect(room.slug).toBe('test');
  });
  it('should findAll rooms', () => {
    const userId = 'test';
    expect(service.findAll(userId)).toHaveLength(0);
    const room = service.create('test', 'test');
    service.addUserToRoom(room.slug, userId, RoomRoles.owner);
    expect(service.findAll(userId)).toHaveLength(1);
    service.create('test1', 'test');
    expect(service.findAll(userId)).toHaveLength(1);
  });
  it('should find one room', () => {
    const room = service.create('test', 'test');
    const fetchedRoom = service.findOne(room.id);
    expect(fetchedRoom).toBeDefined();
    expect(room.id).toBe(1);
    expect(room.name).toBe('test');
    expect(room.slug).toBe('test');
  });
  it('should update room', () => {
    const room = service.create('test', 'test');
    service.update(room.slug, 'test2');
    const fetchedRoom = service.findOne(room.id);
    expect(fetchedRoom).toBeDefined();
    expect(fetchedRoom.id).toBe(1);
    expect(fetchedRoom.name).toBe('test2');
    expect(fetchedRoom.slug).toBe('test');
  });
  it('should remove room', () => {
    const userId = 1;
    expect(service.findAll(userId)).toHaveLength(0);
    const room = service.create('test', 'test');
    service.remove(room.slug);
    expect(service.findAll(userId)).toHaveLength(0);
  });
  it('should manage user in room', () => {
    const userId = 'testing';
    const userId1 = 'testing1';
    const room = service.create('test', 'test');
    service.addUserToRoom(room.slug, userId, RoomRoles.owner);
    expect(service.getRoomMembers(room.id)).toHaveLength(1);
    service.addUserToRoom(room.slug, userId1, RoomRoles.owner);
    expect(service.getRoomMembers(room.id)).toHaveLength(2);
    service.removeUserFromRoom(room.id, userId);
    expect(service.findAll(userId)).toHaveLength(0);
  });
});
