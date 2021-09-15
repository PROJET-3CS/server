//

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";
import { User } from "src/modules/users/models/user.entity";
const { Op } = require("sequelize");

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    ) {}

  async canActivate(context: ExecutionContext):Promise<any> {
    try {
      const roles = this.reflector.get<string[]>("roles", context.getHandler());
      let returnBool: boolean;
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();

      const token = (request.headers.authorization as string).split(" ")[1];
      const decoded: any = jwt.verify(token, "JWT_KEY");
          const user = await User.findOne({
            where: { email: decoded.email },
          });
          if (!user) {
            throw new UnauthorizedException();
          } else {
            var UserRole: String = "patient";
            if (roles[0] === "admin") {
              UserRole = "admin";
            }
            switch (user.role) {
              case 0:
                UserRole = "admin";
                break;
              case 1:
                UserRole = "doctor";
                break;
              case 2:
                UserRole = "patient";
                break;
              case 3:
                UserRole = "assistant";
                break;
              default:
                UserRole = "patient";
            }

            return roles[0] === UserRole;
          }

    } catch (error) {
      console.log(error.message);
    }
  }
}
