import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // do not ignore if expired
      secretOrKey: 'mySecretKeyForJWTOverHere',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('jwt.strategy.ts->validate: ', username, password);
    return 'suceess validate jwt strategy';
  }
}
