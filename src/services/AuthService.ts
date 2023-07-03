import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { UserOTP, UserOTPKind } from '../entities/UserOTP';
import { generateOTP } from '../utils/helper';
import { UserLogin } from '../entities/UserLogin';
import { UserLoginInput } from '../inputs/UserLoginInput';
import { compare } from 'bcrypt';
import { UserLoginNotFoundError } from '../errors/UserLoginNotFoundError';
import { UserPasswordMatchesError } from '../errors/UserPasswordMatchesError';

const OTP_TTL_MINUTES = 3; // 3 minutes expiry

@Service()
export class AuthService {
  constructor(
    @Inject('UserLoginRepository')
    private userLoginRepository: Repository<UserLogin>,
    @Inject('UserOtpRepository') private userOtpRepository: Repository<UserOTP>
  ) {}

  async verifyPasswordAndCreateOtp(loginInput: UserLoginInput) {
    const existingUserLogin = await this.userLoginRepository.findOne({
      where: {
        username: loginInput.username,
      },
    });
    if (!existingUserLogin) {
      throw new UserLoginNotFoundError(loginInput.username);
    }
    const passwordMatches = await compare(
      loginInput.password,
      existingUserLogin.password
    );
    if (!passwordMatches) {
      throw new UserPasswordMatchesError(loginInput.username);
    }
    await this.createOtp(existingUserLogin, UserOTPKind.LOGIN);
    return true;
  }

  /**
   * Create a new OTP
   * @param userLogin
   * @param kind
   * @param txBlock Optional. Transaction callback to create OTP on any existing transaction.
   * @returns
   */
  async createOtp(
    userLogin: UserLogin,
    kind: UserOTPKind,
    txBlock?: (userOtp: UserOTP) => Promise<UserOTP>
  ) {
    let existingOtp: UserOTP | null = await this.userOtpRepository.findOneBy({
      userLogin: {
        id: userLogin.id,
      },
      kind: kind,
    });

    if (!existingOtp) {
      existingOtp = new UserOTP(userLogin, kind);
    } else {
      existingOtp.otp = generateOTP();
      existingOtp.createdAt = new Date();
    }
    if (txBlock) {
      return txBlock(existingOtp);
    }
    return this.userOtpRepository.save(existingOtp);
  }

  getOtp(username: string) {
    return this.userOtpRepository
      .createQueryBuilder('userOtp')
      .leftJoinAndSelect('userOtp.userLogin', 'userLogin')
      .where('userOtp.kind = "phone" AND userLogin.username = :username', {
        username,
      })
      .getOne();
  }

  async getUserFromSession(username: string) {
    const userLogin = await this.userLoginRepository.findOne({
      where: {
        username: username,
      },
    });
    return userLogin?.user;
  }

  async verifyOtp(userId: number, otp: string, kind: UserOTPKind) {
    const curDateTime = new Date();
    const existingOtp = await this.userOtpRepository.findOne({
      where: {
        userLogin: {
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
