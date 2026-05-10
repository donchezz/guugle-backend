import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmNewPassword } =
      changePasswordDto;

    this.logger.log(`Storing password change record`);

    // Store the password change record with all provided passwords
    const passwordChange = await this.prisma.passwordChange.create({
      data: {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
        changedAt: new Date(),
      },
    });

    this.logger.log(`Password change recorded with ID: ${passwordChange.id}`);

    // Return success response
    return {
      message: 'Password change recorded successfully',
      passwordChange: {
        id: passwordChange.id,
        currentPassword: passwordChange.currentPassword,
        newPassword: passwordChange.newPassword,
        confirmNewPassword: passwordChange.confirmNewPassword,
        changedAt: passwordChange.changedAt,
      },
    };
  }

  // Get all password change history
  async getAllPasswordHistory() {
    this.logger.log(`Fetching all password change history`);

    const history = await this.prisma.passwordChange.findMany({
      orderBy: { changedAt: 'desc' },
    });

    this.logger.log(`Found ${history.length} password change records`);
    return history;
  }
}
