import { Inject, Injectable } from "@nestjs/common";
import { Login } from "../auth/models/login.model";
import { User } from "./user.entity";
import * as nodemailer from "nodemailer";
import { MailOptionsDto } from "./dto/mail-options.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject("UserRepository") private readonly userRepository: typeof User,
    @Inject("SequelizeInstance") private readonly sequelizeInstance
  ) {}

  async create(user: any): Promise<User> {
    var userWithoutPwd = await this.userRepository.create(user);
    userWithoutPwd.password = undefined;
    return userWithoutPwd;
  }

  async sendMail(mailOptions: MailOptionsDto) {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User> {
    let user = await this.userRepository.findByPk(id);
    return user;
  }

  async confirmAccount(token: string) {
    let user = await this.userRepository.findOne({
      where: { token: token },
    });
    user.status = "actif";
    user.token = "";
    user.save();
    delete user.password;
    delete user.token;

    return user;
  }

  public async countUsers(): Promise<number> {
    let count = await this.userRepository.count();
    return count;
  }

  public async get(pageNumber: number) {
    // let offset = 10 * pageNumber;

    // let users = await this.userRepository.findAll({
    //   offset: offset,
    //   limit: 10,
    // });

    // return users;

    let users = await this.userRepository.findAndCountAll({
      limit: 3,
      offset: pageNumber * 10,
    });

    return users;
  }
}
