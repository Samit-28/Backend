import {
  Body,
  Get,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { LaptopService } from './laptop.service';
import { laptopDto } from './dto/laptop_dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorators'; // Todo
import { RolesGuards } from 'src/common/guards/roles.guards'; // Todo
import { Public } from 'src/common/decorators/public.decorator';
import { putLaptopForsaleDto } from './dto/PutLaptopForSaleDto';

@Controller('laptop')
@UseGuards(JwtAuthGuard, RolesGuards)
export class LaptopController {
  constructor(private laptopService: LaptopService) {}

  @Roles('ADMIN')
  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  async addLaptop(
    @Body() createLaptopDto: laptopDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const laptop = await this.laptopService.addLaptop(createLaptopDto, file);
    return {
      message: 'Laptop added successfully',
      data: laptop,
    };
  }

  @Roles('ADMIN')
  @Patch('assign')
  async assignLaptop(
    @Body('userId') userId: number,
    @Body('laptopId') laptopId: number,
  ) {
    const laptop = await this.laptopService.assignLaptop(userId, laptopId);
    return {
      message: 'Laptop assigned successfully',
      data: laptop,
    };
  }

  // i will make it better for now its ok

  @Roles('ADMIN')
  @Patch('addforsale')
  async togglesale(@Body() dto: putLaptopForsaleDto) {
    const listedForSale = await this.laptopService.putLaptopForSale(dto);
    return {
      message: 'Laptop sale status updated successfully',
      data: listedForSale,
    };
  }

  @Public()
  @Get('all')
  async getAlllaptops() {
    const laptops = await this.laptopService.getAllLaptops();
    return {
      message: 'Laptops fetched successfully',
      data: laptops,
    };
  }

  @Public()
  @Get('forSale')
  async getLaptopsForSale() {
    const laptops = await this.laptopService.laptopsForSale();
    return {
      message: 'Laptops for sale fetched successfully',
      data: laptops,
    };
  }

  // not assigned laps
  @Get('notassigned')
  async getNotAssignedLaps() {
    const laptops = await this.laptopService.notAssignedLaptops();
    return {
      message: 'Not assigned laptops fecthed successfully',
      data: laptops,
    };
  }

  // Get intrested users for a laptops
  @Roles('ADMIN')
  @Get('intrestedusers')
  async getIntrestedUsers() {
    const intrestedUsers = await this.laptopService.getIntrestedUsers();
    return {
      message: 'Intrested users fetched successfully',
      data: intrestedUsers,
    };
  }

  //not for sale laps all

  @Roles('ADMIN')
  @Get('notforsalelaps')
  async notForSaleLaptops() {
    const laptops = await this.laptopService.notForSaleLaptops();
    return {
      message: 'Not for sale laptops fecthed successfully',
      data: laptops,
    };
  }

  @Roles('ADMIN')
  @Delete('removesale')
  async removeLaptopSaleRecord(@Body('laptopId') laptopId: number) {
    const removedLaptopSale =
      await this.laptopService.removeLaptopFromSale(laptopId);
    return {
      message: 'Laptop removed from sale successfully',
      data: removedLaptopSale,
    };
  }

  // new mail feature
  @Post('userinterest')
  async userInrestInLaptop(
    @Body('laptopId') laptopId: number,
    @Body('userId') userId: number,
  ) {
    const result = await this.laptopService.userIntrestedInLaptop(
      laptopId,
      userId,
    );
    return {
      message: 'Your interest has been recorded successfully',
      data: result,
    };
  }
}
