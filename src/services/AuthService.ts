import { Inject, Service } from 'typedi';
import { MoreThanOrEqual, Repository, Transaction } from 'typeorm';
import { UserOTP, UserOTPKind } from '../entities/UserOTP';
import { User } from '../entities/User';
import { generateOTP } from '../utils/helper';

const OTP_TTL_MINUTES = 3; // 3 minutes expiry

@Service()
export class AuthService {
  constructor(
    @Inject('UserOtpRepository') private userOtpRepository: Repository<UserOTP>
  ) {}

  async createOtp(
    user: User,
    kind: UserOTPKind,
    txBlock?: (userOtp: UserOTP) => Promise<UserOTP>
  ) {
    let existingOtp: UserOTP | null = await this.userOtpRepository.findOneBy({
      user: {
        id: user.id,
      },
      kind: kind,
    });

    if (!existingOtp) {
      existingOtp = new UserOTP(user, kind);
    } else {
      existingOtp.otp = generateOTP();
    }
    if (txBlock) {
      return txBlock(existingOtp);
    }
    return this.userOtpRepository.save(existingOtp);
  }

  async verifyOtp(userId: number, otp: string, kind: UserOTPKind) {
    const curDateTime = new Date();
    const existingOtp = await this.userOtpRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        kind: kind,
      },
    });

    if (!existingOtp) {
      console.debug(
        `Verification OTP does not exist for userId: '${userId}', kind: '${kind}'`
      );
      return false;
    }

    const validUntil = new Date(existingOtp.createdAt);
    validUntil.setMinutes(validUntil.getMinutes() + OTP_TTL_MINUTES);

    return existingOtp.otp === otp && curDateTime < validUntil;
  }
}
