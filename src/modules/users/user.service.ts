import { Inject, Injectable } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserRequests } from './models/userRequests.entity';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { MailOptionsDto } from './dto/mail-options.dto';
const { Op } = require('sequelize');
import { MedicalFolderService } from '../medical-folder/medical-folder.service';
import * as bcrypt from 'bcrypt';

const chalk = require('chalk');
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

@Injectable()
export class UserService {
  constructor(
    private readonly medicalFolderService: MedicalFolderService,

    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('UserRequestsRepository')
    private readonly userRequestsRepository: typeof UserRequests
  ) {}

  async create(user: any): Promise<User> {
    var userWithoutPwd = await this.userRepository.create(user);
    userWithoutPwd.password = undefined;
    return userWithoutPwd;
  }

  public async sendMail(mailOptions: MailOptionsDto) {
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
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

  public async get(pageNumber: number, items: number) {
    let users = await this.userRepository.findAndCountAll({
      limit: Number(items),
      offset: Number(pageNumber) * Number(items),
      attributes: { exclude: ['password'] },
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
          user.token = '';
          let hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          user.save();
          return { status: 'success', body: 'password updated successfully' };
        }
      }
      return {
        status: 'failed',
        body: "password doesn't match the confirmation password",
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: 'failed',
        body: 'an error occured , please try again later',
      };
    }
  }

  // @ROUTE Confirm account with token
  async confirmAccount(token: string) {
    try {
      let user = await this.userRepository.findOne({
        where: { token: token },
      });
      user.status = 'actif';
      user.save();
      delete user.password;
      this.medicalFolderService.create(user.id);
      return { status: 'success', body: user };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'an error occured' };
    }
  }

  // @ROUTE Get one user with ID
  public async getUser(id: number) {
    try {
      let user = await this.findUserById(id);

      let medicalFolder =
        await this.medicalFolderService.getMedicalFolderByUserId(id);

      if (user) {
        user.password = undefined;
        user.token = undefined;
        return {
          status: 'success',
          body: { user, medicalFolder },
        };
      }
      return { status: 'failed', body: "user doesn't exists" };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'An error occured , try later' };
    }
  }

  // @ROUTE Get all users using pagination
  public async getUsers(page: number, items: number) {
    try {
      let users = await this.get(Number(page), Number(items));

      return {
        status: 'success',
        body: {
          count: users.count,
          users: users.rows,
          currentPage: page,
          totalPages: Math.ceil(Number(users.count) / items),
        },
      };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'An error occured , try later' };
    }
  }

  // @ROUTE Get all users using pagination

  /// temporaire sol to get all users
  public async getAllUsers() {
    try {
     let allUsers= await this.userRepository.findAll()
     return{status : "success" , body : allUsers}
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'An error occured , try later' };
    }
  }

  async updateUser(id: number, userUpdated) {
    try {
      let user = await this.findUserById(id);
      if (!user)
        return { status: 'failed', body: "user doesen't exist successfuly" };
      const {
        firstname,
        lastname,
        email,
        gender,
        birthDay,
        birthPlace,
        address,
        speciality,
        typePatient,
        age,
        promo,
        groupe,
      } = userUpdated;

      user.firstname = firstname || user.firstname;
      user.lastname = lastname || user.lastname;
      user.email = email || user.email;
      user.gender = gender || user.gender;
      user.birthDay = birthDay || user.birthDay;
      user.birthPlace = birthPlace || user.birthPlace;
      user.address = address || user.address;
      user.speciality = speciality || user.speciality;
      user.typePatient = typePatient || user.typePatient;
      user.age = age || user.age;
      user.promo = promo || user.promo;
      user.groupe = groupe || user.groupe;

      user.save();
      return { status: 'success', body: user };
    } catch (err) {
      console.log(error(err.message));
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
        const token = jwt.sign({ email: newUser.email }, 'secret');

        //create new user with pending status
        this.create({ ...newUser, token: token });

        //send the confirmation mail
        let mailOptions = {
          from: 'no-reply@gmail.com',
          to: newUser.email,
          subject: 'Verify Email',
          text: 'Verify Email',
          html: `<h1>Email Confirmation</h1>
                <h2>Hello ${newUser.firstname} ${newUser.lastname}</h2>
                <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                <a href=http://localhost:3000/users/confirm/${token}> Click here</a>
                `,
        };
        this.sendMail(mailOptions);

        return { status: 'success', body: 'user created successfuly' };
      }
      return { status: 'failed', body: 'this email already exists' };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: 'failed',
        body: 'an error occured , please try again later',
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
          status: 'failed',
          body: "account doesn't exist",
        };
      }

      const token = jwt.sign({ userId: user.id }, 'secret');
      user.token = token;
      user.save();
      let mailOptions = {
        from: 'no-reply@gmail.com',
        to: email,
        subject: 'reset password',
        text: 'reset passwordt',
        html: `<h1>Reset Password</h1>
            <h2>Hello ${user.firstname} ${user.lastname}</h2>
            <p> Please reset your password by clicking on the following link</p>
            <a href=http://${process.env.BASE_URL}/users/forgot_password/${user.id}/${token}> Click here</a>
            `,
      };

      this.sendMail(mailOptions);
      return {
        status: 'success',
        body: 'please check your mail',
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: 'failed',
        body: 'an error occured , please try again later',
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
      let user = await this.findUserById(userId);
      let decodedToken = jwt.verify(token, 'secret');

      if (!(user.token === token))
        return { status: 'failed', body: 'invalid link' };

      return await this.updatePassword(userId, password, passwordConfirmation);
    } catch (err) {
      console.log(error(err.message));
    }
  }

  public async requestRegistration(regisrationRequest) {
    try {
      const { firstname, lastname, email } = regisrationRequest;

      let user = await this.findUserByEmail(email);
      if (user)
        return {
          status: 'failed',
          body: 'this email is already used by another user',
        };

      let request = await this.userRequestsRepository.findOne({
        where: { email: email },
      });

      if (!request) {
        await this.userRequestsRepository.create({
          firstname,
          lastname,
          email,
        });
        return {
          status: 'success',
          body: 'registration request sent successfuly',
        };
      }
      return {
        status: 'failed',
        body: 'registration request for this user already exist',
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: 'failed',
        body: 'an error occured, please try agian later',
      };
    }
  }

  public async acceptRegistrationRequest(id: number) {
    try {
      let request = await this.userRequestsRepository.findByPk(id);
      if (!request)
        return {
          success: 'failed',
          body: "this registration request doesn't exist",
        };
      const newUser = {
        firstname: request.firstname,
        lastname: request.lastname,
        email: request.email,
        role: 3,
      };
      this.createUserWithConfirmationToken(newUser);
      this.userRequestsRepository.destroy({ where: { id: id } });

      return {
        success: 'success',
        body: 'registration request accepted successfuly',
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: 'failed',
        body: 'an error occured, please try agian later',
      };
    }
  }

  public async declineRegistrationRequest(id: number) {
    try {
      let request = await this.userRequestsRepository.findByPk(id);
      if (!request)
        return {
          success: 'failed',
          body: "this registration request doesn't exist",
        };
      await this.userRequestsRepository.destroy({ where: { id: id } });
      return {
        success: 'success',
        body: 'registration request declined successfuly',
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: 'failed',
        body: 'an error occured, please try agian later',
      };
    }
  }

  public async getRequests(pageNumber: number) {
    try {
      let requests = await this.userRequestsRepository.findAndCountAll({
        limit: 10,
        offset: pageNumber * 10,
      });
      const count = await this.userRequestsRepository.count();
      return {
        status: 'success',
        body: {
          count: requests.count,
          requests: requests.rows,
          currentPage: pageNumber,
          totalPages: Math.ceil(count / 10),
        },
      };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'An error occured , try later' };
    }
  }

  //filtre Users
  public async filterMeth(userParams: any) {
    try {
      //check if there is minimum one parametre
      const isEmpty = Object.values(userParams).every(
        (attribute) =>
          attribute === null || attribute === '' || attribute === undefined
      );

      //if qeuery it empty init firstname with dollar to make sure users=[]
      if (isEmpty) {
        userParams.firstname = '$';
      }

      //searching with params if null use % to give all values
      const users = await this.userRepository.findAll({
        where: {
          [Op.and]: {
            firstname: { [Op.like]: userParams.firstname || '%' },
            lastname: { [Op.like]: userParams.lastname || '%' },
            email: { [Op.like]: userParams.email || '%' },
            gender: { [Op.like]: userParams.gender || '%' },
            birthPlace: { [Op.like]: userParams.birthPlace || '%' },
            address: { [Op.like]: userParams.address || '%' },
            age: { [Op.like]: userParams.age || '%' },
            speciality: { [Op.like]: userParams.speciality || '%' },
            avaialable: { [Op.like]: userParams.avaialable || '%' },
            phone: { [Op.like]: userParams.phone || '%' },
            typePatient: { [Op.like]: userParams.typePatient || '%' },
            status: { [Op.like]: userParams.status || '%' },
          },
        },
      });

      if (users.length == 0) {
        return { status: 'failed', body: 'user not found' };
      } else {
        //hiding user passwords
        users.forEach((user) => {
          user.password = undefined;
        });

        return users;
      }
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'bad params' };
    }
  }

  public async archive(id: number) {
    try {
      let user = await this.findUserById(id);
      if (!user) return { status: 'failed', body: 'this account doesnt exist' };
      if (user.status === 'pendind')
        return {
          status: 'failed',
          body: 'this account is on pendind situation',
        };
      if (user.status === 'archived')
        return {
          status: 'failed',
          body: 'this account was already archived before ',
        };
      user.status = 'archived';
      await user.save();

      return { status: 'success', body: 'account archived successfuly' };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'An error occured , try later' };
    }
  }
}
