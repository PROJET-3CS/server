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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const jwt = require("jsonwebtoken");
const responses_dto_1 = require("./dto/responses.dto");
const swagger_1 = require("@nestjs/swagger");
const requests_dto_1 = require("./dto/requests.dto");
let UserController = class UserController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async signin(body) {
        const newUser = Object.assign({}, body);
        const user = await this.usersService.findUserByEmail(newUser.email);
        if (!user) {
            const token = jwt.sign({ email: newUser.email }, "secret");
            this.usersService.create(Object.assign(Object.assign({}, newUser), { token: token }));
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
            this.usersService.sendMail(mailOptions);
            return { status: "success", message: "user created successfuly" };
        }
        return { status: "failed", message: "this email already exists" };
    }
    async confirmUser(token) {
        this.usersService.confirmAccount(token);
        return "";
    }
    async setPassword(body) {
        let { email, password, passwordConfirmation } = body;
        if (email && password === passwordConfirmation) {
            this.usersService.updatePassword(email, password);
        }
    }
    async updateAccount(user) {
        this.usersService.updateAccount(user);
    }
};
__decorate([
    common_1.Post(),
    swagger_1.ApiOkResponse({ type: responses_dto_1.CreateUserResponseDto }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signin", null);
__decorate([
    common_1.Get("/confirm/:confirmationToken"),
    __param(0, common_1.Param("confirmationToken")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "confirmUser", null);
__decorate([
    common_1.Patch("/updatePassword"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setPassword", null);
__decorate([
    common_1.Patch(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAccount", null);
UserController = __decorate([
    common_1.Controller("users"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map