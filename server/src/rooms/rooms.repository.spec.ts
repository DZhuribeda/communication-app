import { Test, TestingModule } from '@nestjs/testing';
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
    expect(service.findAll()).toHaveLength(0);
    service.create('test', 'test');
    expect(service.findAll()).toHaveLength(1);
    service.create('test', 'test');
    expect(service.findAll()).toHaveLength(2);
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
    service.update(room.id, 'test2');
    const fetchedRoom = service.findOne(room.id);
    expect(fetchedRoom).toBeDefined();
    expect(fetchedRoom.id).toBe(1);
    expect(fetchedRoom.name).toBe('test2');
    expect(fetchedRoom.slug).toBe('test');
  });
  it('should remove room', () => {
    expect(service.findAll()).toHaveLength(0);
    const room = service.create('test', 'test');
    service.remove(room.id);
    expect(service.findAll()).toHaveLength(0);
  });
});
