import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { laptopDto } from './dto/laptop_dto';
import { DbService } from 'src/db/db.service';
import { putLaptopForsaleDto } from './dto/PutLaptopForSaleDto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LaptopService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private dbService: DbService,
    private eventEmitter: EventEmitter2,
  ) {}

  // Add new Laptop Admins can add Laptops
  async addLaptop(data: laptopDto, file?: Express.Multer.File) {
    let imageUrl = '';

    if (file) {
      const uploadImage = await this.cloudinaryService.uploadImage(
        file,
        'laptops',
      );
      imageUrl = uploadImage.secure_url;
    }
    const addlaptop = await this.dbService.laptop.create({
      data: {
        model: data.model,
        brand: data.brand,
        isAssigned: data.isAssigned,
        isForSale: data.isForSale,
        specifications: data.specifications,
        condition: data.condition,
        usageMonths: data.usageMonths ?? 0,
        price: data.price,
        imageUrl,
      },
    });

    return addlaptop;
  }

  async assignLaptop(userId: number, laptopId: number) {
    // check laptop and user first outside transaction -- no lock hold

    const laptop = await this.dbService.laptop.findUnique({
      where: { id: laptopId },
    });
    if (!laptop) throw new NotFoundException('Laptop not found');
    if (laptop.isAssigned)
      throw new BadRequestException('Laptop is already assigned');

    const user = await this.dbService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('user not found');
    if (user.assignedLaptopId)
      throw new BadRequestException('user already has a laptop assigned');

    // transaction to assign laptop

    const [updatedLaptop] = await this.dbService.$transaction([
      this.dbService.laptop.update({
        where: { id: laptopId },
        data: {
          isAssigned: true,
          assignedTo: { connect: { id: userId } },
        },
      }),
      this.dbService.user.update({
        where: { id: userId },
        data: { assignedLaptopId: laptopId },
      }),
    ]);

    return {
      message: 'Laptop assigned successfully',
      data: updatedLaptop,
    };
  }
  // All laptops with sale details and assigned user details...

  async getAllLaptops() {
    const laptops = await this.dbService.laptop.findMany({
      include: {
        assignedTo: true,
        saleInfo: {
          include: {
            listedBy: true,
          },
        },
      },
    });
    return laptops;
  }

  // All Laptops which are for sale...

  async laptopsForSale() {
    const laptops = await this.dbService.laptop.findMany({
      where: {
        isForSale: true,
      },
      include: {
        assignedTo: true,
        saleInfo: {
          include: {
            listedBy: true,
          },
        },
      },
    });
    return laptops;
  }

  // Only unAssigned laptops means not assigned to any user yet ...

  async notAssignedLaptops() {
    const laptops = await this.dbService.laptop.findMany({
      where: {
        isAssigned: false,
      },
    });
    return laptops;
  }

  // only laptops which are not for sale ..

  async notForSaleLaptops() {
    const laptops = await this.dbService.laptop.findMany({
      where: {
        isForSale: false,
      },
    });
    return laptops;
  }

  // Add existing laptop to sale ...

  async putLaptopForSale(data: putLaptopForsaleDto) {
    return await this.dbService.$transaction(async (tx) => {
      const updatedLaptop = await tx.laptop.updateMany({
        where: {
          id: data.laptopId,
          isForSale: false,
        },
        data: {
          isForSale: true,
        },
      });
      if (updatedLaptop.count === 0) {
        const exists = await tx.laptop.findUnique({
          where: { id: data.laptopId },
        });
        if (!exists) throw new NotFoundException('Laptop not found');
        throw new BadRequestException('Laptop is already listed for sale');
      }
      // creating sale record
      const saleRecord = await tx.laptopSale.create({
        data: {
          laptopId: data.laptopId,
          salePrice: data.salePrice,
          listedById: data.listedById,
        },
        include: {
          laptop: true,
          listedBy: true,
        },
      });
      return {
        message: 'Laptop listed successfully',
        saleRecord,
      };
    });
  }

  // Get ann info of Intrested users

  async getIntrestedUsers() {
    const intrestedUsers = await this.dbService.purchase.findMany({
      include: {
        user: true,
        laptop: true,
      },
    });
    return {
      message: 'Intrested users fetched successfully',
      data: intrestedUsers,
    };
  }

  // when you need to remove laptop from sale

  async removeLaptopFromSale(laptopId: number) {
    return await this.dbService.$transaction(async (tx) => {
      const laptop = await tx.laptop.findUnique({
        where: { id: laptopId },
      });
      if (!laptop) throw new NotFoundException('Laptop not found');
      if (!laptop.isForSale)
        throw new BadRequestException('Laptop is not listed for sale');

      // remove status of for sale
      await tx.laptop.update({
        where: { id: laptopId },
        data: {
          isForSale: false,
        },
      });
      // delete sale record
      const deleteSaleRecord = await tx.laptopSale.deleteMany({
        where: { laptopId: laptopId },
      });
      return {
        message: 'laptop removed for sale successfully',
        deleteSaleCount: deleteSaleRecord.count,
      };
    });
  }
  // user intrested in laptop ... send mail to hr .

  async userIntrestedInLaptop(laptopId: number, userId: number) {
    const laptop = await this.dbService.laptopSale.findUnique({
      where: { laptopId: laptopId },
    });

    const user = await this.dbService.user.findUnique({
      where: { id: userId },
    });

    if (!laptop) throw new NotFoundException('Laptop not found');
    if (!user) throw new NotFoundException('User not found');

    const purchaseInfo = await this.dbService.purchase.create({
      data: {
        laptopId: laptopId,
        userId: userId,
        purchasePrice: laptop.salePrice,
      },
      include: {
        laptop: true,
        user: true,
      },
    });

    // emit event to send mail

    this.eventEmitter.emit('purchase.interested', {
      laptopId: laptop.laptopId,
      userName: user.name,
      userEmail: user.email,
      salePrice: laptop.salePrice,
    });
    return { message: 'Purchase interest recorded successfully', purchaseInfo };
  }
}
