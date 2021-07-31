<<<<<<< HEAD
import { Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
=======
import { Inject, Injectable } from '@nestjs/common';
import { Login } from '../auth/models/login.model';
import { User } from './user.entity';
import { compare } from 'bcryptjs';
>>>>>>> a525e3f83316f618a555ef77a3fb5b6da601db55

@Injectable()
export class UserService {
  constructor(
    @Inject("UserRepository") private readonly userRepository: typeof User,
    @Inject("SequelizeInstance") private readonly sequelizeInstance
  ) {}

  public async create(user: any): Promise<User> {
    return await this.userRepository.create(user);
  }

<<<<<<< HEAD
  public async get(): Promise<any[]> {
    return await this.userRepository.findAll();
  }
=======
    public async create(user: any): Promise<User> {
            return await this.userRepository.create(user)
    }

    async login(loginObject: any): Promise<User> {
        const { name } = loginObject;
    
        const user = await this.userRepository.findOne( name );

        console.log(user);
        

        if(!user) console.log('success');
        
        // }
    
        return user;
      }
>>>>>>> a525e3f83316f618a555ef77a3fb5b6da601db55
}
