import { Inject, Injectable } from "@nestjs/common";
import { Login } from "../auth/models/login.model";
import { User } from "./user.entity";
import * as nodemailer from "nodemailer";
import * as jwt from "jsonwebtoken";
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

  public async get(pageNumber: number) {
    let users = await this.userRepository.findAndCountAll({
      limit: 3,
      offset: pageNumber * 10,
    });

    return users;
  }

  public async updatePassword(
    userId: number,
    password: string,
    passwordConfirmation: string
  ) {
    try {
      if (password === passwordConfirmation) {
        let user = await this.findUserById(userId);
        if (user) {
          user.token = "";
          user.password = password;
          user.save();
          return { status: "success", body: "password updated successfully" };
        }
      }
      return {
        status: "failed",
        body: "password doesn't match the confirmation password",
      };
    } catch (error) {
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  // @ROUTE Confirm account with token
  async confirmAccount(token: string) {
    try {
      let user = await this.userRepository.findOne({
        where: { token: token },
      });
      user.status = "actif";
      user.token = "";
      user.save();
      delete user.password;
      delete user.token;

      return { status: "sucess", body: user };
    } catch (error) {
      return { status: "failed", body: "an error occured" };
    }
  }

  // @ROUTE Get one user with ID
  public async getUser(id: number) {
    try {
      let user = await this.findUserById(id);
      if (user) {
        user.password = undefined;
        user.token = undefined;
        return {
          status: "success",
          body: user,
        };
      }
      return { status: "failed", body: "user doesn't exists" };
    } catch (error) {
      console.log(error);
      return { status: "failed", body: "An error occured , try later" };
    }
  }

  // @ROUTE Get all users using pagination
  public async getUsers(pageNumber: number) {
    try {
      let users = await this.get(pageNumber);

      return {
        status: "success",
        body: {
          count: users.count,
          users: users.rows,
          currentPage: pageNumber,
          totalPages: Math.ceil(users.count / 10),
        },
      };
    } catch (error) {
      console.log(error);
      return { status: "failed", body: "An error occured , try later" };
    }
  }

  // @ROUTE create user
  public async createUserWithConfirmationToken(newUser) {
    try {
      //verify if the email exists
      const user = await this.findUserByEmail(newUser.email);

      //if the email doesn't exist _ create new user and send the confirmation mail _
      if (!user) {
        //generate confirmation token
        const token = jwt.sign({ email: newUser.email }, "secret");

        //create new user with pending status
        this.create({ ...newUser, token: token });

        //send the confirmation mail
        let mailOptions = {
          from: "no-reply@gmail.com",
          to: newUser.email,
          subject: "Verify Email",
          text: "Verify Email",
          html: `<h1>Email Confirmation</h1>
                <h2>Hello ${newUser.firstname} ${newUser.lastname}</h2>
                <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                <a href=http://localhost:3000/users/confirm/${token}> Click here</a>
                `,
        };
        this.sendMail(mailOptions);

        return { status: "success", body: "user created successfuly" };
      }
      return { status: "failed", body: "this email already exists" };
    } catch (erroe) {
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  // @ROUTE forgot password
  public async forgotPasswort(email: string) {
    try {
      let user = await this.findUserByEmail(email);

      // if user not fount
      if (!user) {
        return {
          status: "failed",
          body: "account doesn't exist",
        };
      }

      const token = jwt.sign({ userId: user.id }, "secret");
      user.token = token;
      user.save();
      let mailOptions = {
        from: "no-reply@gmail.com",
        to: email,
        subject: "reset password",
        text: "reset passwordt",
        html: `<h1>Reset Password</h1>
            <h2>Hello ${user.firstname} ${user.lastname}</h2>
            <p> Please reset your password by clicking on the following link</p>
            <a href=http://${process.env.BASE_URL}/users/forgot_password/${user.id}/${token}> Click here</a>
            `,
      };

      this.sendMail(mailOptions);
      return {
        status: "success",
        body: "please check your mail",
      };
    } catch (error) {
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  // @ROUTE update password with token
  public async updateForgottenPassword(
    userId: number,
    token: string,
    password: string,
    passwordConfirmation: string
  ) {
    try {
      let decodedToken = jwt.verify(token, "secret");
      if (Number(decodedToken) === userId)
        this.updatePassword(userId, password, passwordConfirmation);
      return { status: "failed", body: "invalid link" };
    } catch (error) {}
  }
}
