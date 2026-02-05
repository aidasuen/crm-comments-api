import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  
  async getTokens(userId: string, role: string) {
    const payload = { sub: userId, role: role };
    
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m', secret: 'AT_SECRET' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d', secret: 'RT_SECRET' }),
    ]);

    return { accessToken: at, refreshToken: rt };
  }

 
async validateUser(email: string, pass: string): Promise<any> {
  const user = await this.usersService.findByEmail(email); 
  
  
  if (user && await bcrypt.compare(pass, user.password)) {
    const { password, ...result } = user;
    return result;
  }
  
 
  return null;
}

async login(user: any) {
  const tokens = await this.getTokens(user.id, user.role);

  
  await this.usersService.setCurrentRefreshToken(user.id, tokens.refreshToken);

  return {
    ...tokens,
    userId: user.id,
    role: user.role,
  };
}

async refreshToken(userId: string, refreshToken: string) {
  const user = await this.usersService.getUserIfRefreshTokenMatches(userId, refreshToken);
  if (!user) {
    throw new ForbiddenException('Неверный refresh token');
  }

  const tokens = await this.getTokens(user.id, user.role);


  await this.usersService.setCurrentRefreshToken(user.id, tokens.refreshToken);

  return {
    ...tokens,
    userId: user.id,
    role: user.role,
  };
}



}