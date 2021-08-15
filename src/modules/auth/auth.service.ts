import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "../users/models/user.entity";
import * as jwt from "jsonwebtoken";
const { Op } = require("sequelize");
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @Inject("UserRepository") private readonly userRepository: typeof User,
    @Inject("SequelizeInstance") private readonly sequelizeInstance
  ) {}

  private _options: any = {
    algorithm: "HS256",
    expiresIn: "1 days",
    jwtid: process.env.JWT_ID || "",
  };

  public async login(loginObject: any): Promise<object> {
    const { email, password } = loginObject;

    const user = await this.userRepository.findOne({
      where: {
        [Op.and]: [{ email: email }, { password: password }],
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    } else {
      const payload = {
        id: user.id,
        email: user.email,
        password: user.password,
      };

      var token = jwt.sign(
        payload,
        process.env.JWT_KEY || "JWT_KEY",
        this._options
      );

      user.password = undefined;

      return { token, user };
    }
  }
  public async verify_token(token: string): Promise<Object> {
    try {
      const isValid: Object = jwt.verify(
        token,
        process.env.JWT_KEY || "JWT_KEY"
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

      return { user, isValid: isValid && user ? true : false };
    } catch (error) {
      return { user: "", isValid: false };
    }
  }
}
