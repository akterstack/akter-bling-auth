import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { User } from './../entities/User';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { DuplicateEntryError } from '../errors/DuplicateEntryError';

@Service()
export class UserService {
  constructor(
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

    return this.userRepository.insert(userToCreate);
  }
}
