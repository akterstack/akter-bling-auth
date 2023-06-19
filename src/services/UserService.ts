import { Inject, Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { User } from './../entities/User';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { DuplicateEntryError } from '../errors/DuplicateEntryError';
import { generatePasswordHash } from '../utils/helper';
import { UserLogin } from '../entities/UserLogin';
import { UserOTP, UserOTPKind } from '../entities/UserOtp';

@Service()
export class UserService {
  constructor(
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

    const userLogin = new UserLogin();
    userLogin.username = userToCreate.email;
    userLogin.password = await generatePasswordHash(userInput.password);

    userToCreate.loginDetail = Promise.resolve(userLogin);

    return this.authDataSource.manager.transaction(async (tx) => {
      const user = await tx.save(userToCreate);
      await tx.save(userLogin);

      const emailVerificationOtp = new UserOTP(
        user,
        UserOTPKind.email_verification
      );
      await tx.save(emailVerificationOtp);

      const phoneVerificationOtp = new UserOTP(
        user,
        UserOTPKind.phone_verification
      );
      await tx.save(phoneVerificationOtp);
      return user;
    });
  }
}
