"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersProvider = void 0;
const user_entity_1 = require("./user.entity");
exports.usersProvider = {
    provide: 'UserRepository',
    useValue: user_entity_1.User
};
//# sourceMappingURL=user.provider.js.map