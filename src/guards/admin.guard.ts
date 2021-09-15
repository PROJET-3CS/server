
// 



import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";
import { User } from "src/modules/users/models/user.entity";
const { Op } = require("sequelize");

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      
      const token = (request.headers.authorization as string).split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
       User.findOne({
         where:{email:decoded.email}
       }).then(user=>{
         if(!user){
          throw new UnauthorizedException();
         }
         else return roles[0]==user.role
       })
      return false;
    } catch (error) {
      console.log(error.message);
      
    }
  }
}
