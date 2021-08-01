import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import { setupSwagger } from "./swagger";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
  console.log(`application running on port : ${process.env.PORT || 3000}`);
}
bootstrap();
