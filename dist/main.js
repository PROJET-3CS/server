"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const swagger_1 = require("./swagger");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    swagger_1.setupSwagger(app);
    await app.listen(process.env.PORT || 3000);
    console.log(`application running on port : ${process.env.PORT || 3000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map