import { Inject, Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { User } from './../entities/User';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { DuplicateEntryError } from '../errors/DuplicateEntryError';
import { generatePasswordHash } from '../utils/helper';
import { UserLogin } from '../entities/UserLogin';
import { UserOTPKind } from '../entities/UserOTP';
import { AuthService } from './AuthService';

@Service()
export class UserService {
  constructor(
    @Inject() private authService: AuthService,
    @Inject('AuthDataSource') private authDataSource: DataSource,
    @Inject('UserRepository') private userRepository: Repository<User>
  ) {}

  async createUser(userInput: UserCreateInput) {
    const userToCreate = new User();
    userToCreate.firstName = userInput.firstName;
    userToCreate.lastName = userInput.lastName;
    userToCreate.email = userInput.email;
    userToCreate.phone = userInput.phone;

    const userExistsForSameEmailOrPhone = await this.userRepository.exist({
      where: [{ email: userToCreate.email }, { phone: userToCreate.phone }],
    });

    if (userExistsForSameEmailOrPhone) {
      throw new DuplicateEntryError(
        `User exists for email (${userToCreate.email}) or phone number (${userToCreate.phone})`
      );
    }

    return this.authDataSource.manager.transaction(async (tx) => {
      const user = await tx.save(userToCreate);

      const userLoginToCreate = new UserLogin();
      userLoginToCreate.username = userToCreate.email;
      userLoginToCreate.password = await generatePasswordHash(
        userInput.password
      );
      userLoginToCreate.user = Promise.resolve(user);

      const userLogin = await tx.save(userLoginToCreate);

      await Promise.all([
        this.authService.createOtp(
          userLogin,
          UserOTPKind.EMAIL,
          async (emailVerificationOtp) => {
            return tx.save(emailVerificationOtp);
          }
        ),
        this.authService.createOtp(
          userLogin,
          UserOTPKind.PHONE,
          async (phoneVerificationOtp) => {
            return tx.save(phoneVerificationOtp);
          }
        ),
      ]);
      return user;
    });
  }

  markEmailVerified(userId: number) {
    return this.userRepository.update(
      { id: userId },
      { isEmailVerified: true }
    );
  }

  markPhoneVerified(userId: number) {
    return this.userRepository.update(
      { id: userId },
      { isPhoneVerified: true }
    );
  }
}
