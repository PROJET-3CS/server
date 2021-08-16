import { Inject, Injectable } from "@nestjs/common";
import { User } from "./models/user.entity";
import { UserRequests } from "./models/userRequests.entity";
import * as nodemailer from "nodemailer";
import * as jwt from "jsonwebtoken";
import { MailOptionsDto } from "./dto/mail-options.dto";
const { Op } = require("sequelize");
import { MedicalFolderService } from "../medical-folder/medical-folder.service";
import { MedicalFolder } from "../medical-folder/medical-folder.entity";

@Injectable()
export class UserService {
  constructor(
    private readonly medicalFolderService: MedicalFolderService,

    @Inject("UserRepository") private readonly userRepository: typeof User,
    @Inject("UserRequestsRepository")
    private readonly userRequestsRepository: typeof UserRequests,
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
      limit: 10,
      offset: pageNumber * 10,
      include: [{ model: MedicalFolder }],
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
      this.medicalFolderService.create(user.id);
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
      let user = await this.findUserById(userId);
      let decodedToken = jwt.verify(token, "secret");

      if (
        !(
          user.token === token && Object(decodedToken).userId === Number(userId)
        )
      )
        return { status: "failed", body: "invalid link" };

      return await this.updatePassword(userId, password, passwordConfirmation);
    } catch (error) {}
  }

  public async requestRegistration(regisrationRequest) {
    try {
      const { firstname, lastname, email } = regisrationRequest;

      let user = await this.findUserByEmail(email);
      if (user)
        return {
          status: "failed",
          body: "this email is already used by another user",
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
          status: "success",
          body: "registration request sent successfuly",
        };
      }
      return {
        status: "failed",
        body: "registration request for this user already exist",
      };
    } catch (error) {
      return {
        status: "failed",
        body: "an error occured, please try agian later",
      };
    }
  }

  public async acceptRegistrationRequest(id: number) {
    try {
      let request = await this.userRequestsRepository.findByPk(id);
      if (!request)
        return {
          success: "failed",
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
        success: "success",
        body: "registration request accepted successfuly",
      };
    } catch (error) {
      return {
        status: "failed",
        body: "an error occured, please try agian later",
      };
    }
  }

  public async declineRegistrationRequest(id: number) {
    try {
      let request = await this.userRequestsRepository.findByPk(id);
      if (!request)
        return {
          success: "failed",
          body: "this registration request doesn't exist",
        };
      await this.userRequestsRepository.destroy({ where: { id: id } });
      return {
        success: "success",
        body: "registration request declined successfuly",
      };
    } catch (error) {
      return {
        status: "failed",
        body: "an error occured, please try agian later",
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
        status: "success",
        body: {
          count,
          requests,
          currentPage: pageNumber,
          totalPages: Math.ceil(count / 10),
        },
      };
    } catch (error) {
      console.log(error);
      return { status: "failed", body: "An error occured , try later" };
    }
  }

  //filtre Users
  public async filterMeth(userParams: any) {

    try {
       // userParams include Url params after split(&) ===== [firstname=XXXX,lastname=XXXX]

       var att_value = {};

       //forEach loop to fill splited userParams in att_value object ['firstname':XXXX,'lastname':XXXX]
       userParams.forEach((element,i) => 
         {
           const key = userParams[i].split('=')[0] 
           const value = userParams[i].split('=')[1];
           att_value[key] = value;            
         }
         );
       //if there is no attrbute matched to route init firstname with $ to make sure get a void return
       var missingAtt = 0
       const atts = ['firstname','lastname','email','gender','birthPlace','adress','age','speciality']

       //count nbr of missing attrbutes if all are missing init firstname with $
       atts.forEach(attr => {
         const link = userParams.toString()
         const bool = link.search(attr)

         //increment every missing of  
         if(bool<0) missingAtt++;          
       });

       if (missingAtt==8) {
         att_value['firstname']="$"   
       }     
       
       //if  att value is undifined assign % like option
       const users = await this.userRepository.findAll({
          where: {
            [Op.and]:{
              firstname: { [Op.like]: att_value[atts[0]]   || '%'},
              lastname:  { [Op.like]: att_value[atts[1]]   || '%'},
              email:     { [Op.like]: att_value[atts[2]]   || '%'},
              gender:    { [Op.like]: att_value[atts[3]]   || '%'},
              birthPlace:{ [Op.like]: att_value[atts[4]]   || '%'},
              adress:    { [Op.like]: att_value[atts[5]]   || '%'},
              age:       { [Op.like]: att_value[atts[6]]   || '%'},
              speciality:{ [Op.like]: att_value[atts[7]]   || '%'},
            }
          }
        });

        if(users.length==0){
          
         return { status: "failed", body: "user not found" };

        }else{
         
         //hiding user passwords
         users.forEach(user => {
           user.password = undefined;
         });

         return users;
       }
          
    } catch (error) {
     return { status: "failed", body: "bad params" };
    }}
     
    


}
