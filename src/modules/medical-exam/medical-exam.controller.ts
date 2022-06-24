import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "src/guards/ roles.decorator";
import { MedicalExamService } from "./medical-exam.service";

@ApiTags("medical_exam")
@Controller("medical_exam")
export class MedicalExamController {
  constructor(private readonly medicalExamService: MedicalExamService) {}

  @Post("/:userId")

  // @Roles("admin")
  // @Roles("doctor")
  // @Roles("assistant")
  async cretaeMedicalExam(@Param("userId") userId: number, @Body() body) {
    return await this.medicalExamService.create(userId, body);
  }

  @Get("/medicalExamId")
  async getMedicalExam(@Param("medicalExamId") medicalExamId: number) {
    return this.medicalExamService.get(medicalExamId);
  }

  @Delete("/medicalExamId")
  async deleteMedicalExam(@Param("medicalExamId") medicalExamId: number) {
    return this.medicalExamService.delete(medicalExamId);
  }

  // rescrition routes
  @Post("/rescritpions/:userId")
  async create(@Param("userId") userId: number, @Body() body) {
    return this.medicalExamService.createRescription(body, userId);
  }

  @Get("/rescritpions")
  async getRescriptions(
    @Query("medicalFolderId") medicalFolderId: number,
    @Query("medicalExamId") medicalExamId: number,
    @Query("doctorId") doctorId: number,
    @Query("page") page: number,
    @Query("items") items: number
  ) {
    let queries = {};

    if (typeof medicalExamId !== "undefined") {
      queries["medicalExamId"] = Number(medicalExamId);
    }
    if (typeof medicalFolderId !== "undefined") {
      queries["medicalFolderId"] = Number(medicalFolderId);
    }
    if (typeof doctorId !== "undefined") {
      queries["doctorId"] = Number(doctorId);
    }
    return this.medicalExamService.getRescriptions(queries, page, items);
  }

  @Post("/documents/:userId")
  async createDocument(@Param("userId") userId: number, @Body() body) {
    return this.medicalExamService.createDocument(body, userId);
  }

  @Get("/documents")
  async getDocuments(
    @Query("medicalFolderId") medicalFolderId: number,
    @Query("medicalExamId") medicalExamId: number,
    @Query("doctorId") doctorId: number,
    @Query("type") type: string,
    @Query("page") page: number,
    @Query("items") items: number
  ) {
    let queries = {};

    if (typeof medicalExamId !== "undefined") {
      queries["medicalExamId"] = Number(medicalExamId);
    }
    if (typeof medicalFolderId !== "undefined") {
      queries["medicalFolderId"] = Number(medicalFolderId);
    }
    if (typeof doctorId !== "undefined") {
      queries["doctorId"] = Number(doctorId);
    }
    if (typeof type !== "undefined") {
      queries["type"] = Number(type);
    }
    return this.medicalExamService.getDocuments(queries, page, items);
  }
}
