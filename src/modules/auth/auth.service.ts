import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
import * as jwt from 'jsonwebtoken';
const { Op } = require("sequelize");

@Injectable()
export class AuthService  {
    constructor(
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('SequelizeInstance') private readonly sequelizeInstance,

    ) {}

    private _options: any = {
        algorithm: 'HS256',
        expiresIn: '1 days',
        jwtid: process.env.JWT_ID || ''
    };


    public async login(loginObject: any): Promise<object> {
        const { email , password } = loginObject;
        console.log(loginObject)
    
        const user = await this.userRepository.findOne({               
            where: {
                [Op.and]: [
                    { email: email },
                    { password: password }
                  ]
              }
        } );
                
        if(!user){
            throw new  UnauthorizedException();  
        }else {
        
        const payload = {
            id: user.id,
            email: user.email,
            password: user.password
        };

        var token = jwt.sign(payload, 'JWT_KEY' || '', this._options)
        
        user.password = undefined;

        return {token,user}
        }
      }
}
