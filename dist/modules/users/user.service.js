"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let UserService = class UserService {
    constructor(userRepository, sequelizeInstance) {
        this.userRepository = userRepository;
        this.sequelizeInstance = sequelizeInstance;
    }
    async create(user) {
        var userWithoutPwd = await this.userRepository.create(user);
        userWithoutPwd.password = undefined;
        return userWithoutPwd;
    }
    async sendMail(mailOptions) {
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        await transporter.sendMail(mailOptions);
    }
    async findUserByEmail(email) {
        return await this.userRepository.findOne({ where: { email } });
    }
    async confirmAccount(token) {
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
    async get() {
        const users = await this.userRepository.findAll({
            attributes: ["name", "age"],
        });
        return users;
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject("UserRepository")),
    __param(1, common_1.Inject("SequelizeInstance")),
    __metadata("design:paramtypes", [Object, Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map