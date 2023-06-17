import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { User } from './../entities/User';
import { UserCreateInput } from '../inputs/UserCreateInput';

@Service()
export class UserService {
  constructor(
    @Inject('UserRepository') private userRepository: Repository<User>
  ) {}

  createUser(userInput: UserCreateInput) {
    const userToCreate = new User();
    userToCreate.firstName = userInput.firstName;
    userToCreate.lastName = userInput.lastName;
    userToCreate.email = userInput.email;
    userToCreate.phone = userInput.phone;
    return this.userRepository.save(userToCreate);
  }
}
