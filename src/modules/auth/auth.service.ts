import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/models/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
const { Op } = require('sequelize');
const chalk = require('chalk');
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('SequelizeInstance') private readonly sequelizeInstance
  ) {}

  //config JWT
  private _options: any = {
    algorithm: 'HS256',
    expiresIn: '1 days',
    jwtid: process.env.JWT_ID || '',
  };

  public async login(loginObject: any): Promise<object> {
    try {
      //safeCoding ES6 take only email,pwd
      const { email, password } = loginObject;
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      // compare hash with the given password
      const validPassword = await bcrypt.compare(
        password,
        user.password.toString()
      );
      //if user not found throw Unauthorized Error
      if (!user || !validPassword) {
        throw new UnauthorizedException();
      } else {
        //payload JWT
        const payload = {
          id: user.id,
          email: user.email,
          password: user.password,
        };

        var token = jwt.sign(
          payload,
          process.env.JWT_KEY || 'JWT_KEY',
          this._options
        );

        user.password = undefined;

        return {
          status: 'success',
          body: { token, user },
        };
      }
    } catch (err) {
      console.log(error(err.message));
      return {
        status: 'failed',
        body: 'an error occured , please try again',
      };
    }
  }
  public async verify_token(token: string): Promise<Object> {
    try {
      //verify if token is valid
      const isValid: Object = jwt.verify(
        token,
        process.env.JWT_KEY || 'JWT_KEY'
      );

      let user;
      if (isValid) {
        const decoded: any = jwt.decode(token);
        user = await this.userRepository.findOne({
          where: {
            [Op.and]: [
              { email: decoded.email },
              { password: decoded.password },
            ],
          },
        });
      }

      return {
        user,
        isValid: isValid && user ? true : false,
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: 'failed',
        body: 'not Valid user',
        user: '',
        isValid: false,
      };
    }
  }
}
