import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}


  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (dto.email) {
      const exists = await this.findByEmail(dto.email);
      if (exists) throw new ConflictException('Пользователь с таким email уже существует');
    }

  
    const saltRounds = 10;
    const hash = await bcrypt.hash(dto.password, saltRounds);

  
    const user = this.usersRepo.create({
      ...dto,
      password: hash,
    });

    const savedUser = await this.usersRepo.save(user);

  
    const { password, ...result } = savedUser;
    return result;
  }

  8
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepo.find({
      order: { created_at: 'DESC' },
    });

    return users.map(({ password, ...user }) => user);
  }

  
  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Пользователь с ID ${id} не найден`);

    const { password, ...result } = user;
    return result;
  }

 
async findByEmail(email: string): Promise<User | null> {
  return this.usersRepo.findOne({
    where: { email },
    select: ['id', 'password', 'role', 'email', 'refreshToken'],
  });
}


  
  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.usersRepo.preload({
      id,
      ...dto,
    });

    if (!updated) throw new NotFoundException('Не удалось обновить пользователя');

    const saved = await this.usersRepo.save(updated);
    const { password, ...result } = saved;
    return result;
  }


  async remove(id: string): Promise<{ message: string }> {
    const result = await this.usersRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Пользователь не найден');
    return { message: 'Пользователь удалён успешно' };
  }


  async setCurrentRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    user.refreshToken = refreshToken;
    await this.usersRepo.save(user);
  }


  async getUserIfRefreshTokenMatches(
    userId: string,
    refreshToken: string,
  ): Promise<User | undefined> { 
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user || user.refreshToken !== refreshToken) return undefined;
    return user;
  }
}
