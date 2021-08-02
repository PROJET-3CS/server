import { Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import * as nodemailer from "nodemailer";
import { MailOptionsDto } from "./dto/mail-options.dto";
import * as bcrypt from "bcryptjs";
import { UpdateUserDto } from "./dto/requests.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject("UserRepository") private readonly userRepository: typeof User,
    @Inject("SequelizeInstance") private readonly sequelizeInstance
  ) {}

  async create(user: any): Promise<User> {
    return await this.userRepository.create(user);
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

  async updatePassword(email, password) {
    let user = await this.userRepository.findOne({ where: { email } });
    let genSalt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, genSalt);
    user.password = hashedPassword;
    user.save();
  }

  public async updateAccount(userUpdate: UpdateUserDto) {
    let { email } = userUpdate;

    let user = await this.userRepository.findOne({
      where: { email: "aymen.zitouni7@aiesec.net" },
    });
    user.update(userUpdate);
    console.log(user);
  }

  public async get(): Promise<User[]> {
    const users = await this.userRepository.findAll({
      attributes: ["name", "age"],
    });

    return users;
  }

  async login(loginObject: any): Promise<User> {
    const { name } = loginObject;

    const user = await this.userRepository.findOne(name);

    console.log(user);

    if (!user) console.log("success");

    // }

    return user;
  }
}
