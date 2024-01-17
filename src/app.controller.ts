import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  // authentication
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt')) //authorization
  @Get('jwt')
  async data() {
    return 'success GET jwt';
  }

  @UseGuards(AuthGuard('jwt')) //authorization
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
