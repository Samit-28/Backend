import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuards } from 'src/common/guards/roles.guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuards)
  @Get('unassigned')
  async getAllUsers() {
    return this.userService.getunAssignedUsers();
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuards)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }
}
