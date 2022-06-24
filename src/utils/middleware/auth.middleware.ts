import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "src/modules/users/models/user.entity";
const { Op } = require("sequelize");
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  public async use(req: Request, res: Response, next: NextFunction) {
    next();
    //   if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {

    //     const token = (req.headers.authorization as string).split(' ')[1];
    //     const decoded: any = jwt.verify(token, process.env.JWT_PRIVATE_KEY || 'JWT_KEY');
    //     const user = await User.findOne<User>({
    //         where: {
    //             [Op.and]: [
    //               { email: decoded.email },
    //               { password: decoded.password }
    //             ]
    //         }
    //    });
    //     if (!user) throw new  UnauthorizedException();
    // } else {
    //   throw new  UnauthorizedException();
    // }
  }
}
