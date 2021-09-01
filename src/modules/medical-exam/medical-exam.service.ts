import { Inject, Injectable } from "@nestjs/common";
import { MedicalFolderService } from "../medical-folder/medical-folder.service";
import { User } from "../users/models/user.entity";
import { MedicalExam } from "./models/medical-exam.entity";
import * as chalk from "chalk";

const error = chalk.bold.red;
const warning = chalk.keyword("orange");

@Injectable()
export class MedicalExamService {
  constructor(
    @Inject("MedicalExamRepository")
    private readonly medicalExamRepository: typeof MedicalExam,
    @Inject("UserRepository")
    private readonly userRepository: typeof User,
    private readonly medicalFolderService: MedicalFolderService
  ) {}

  async create(medicalFolderId: number, medicalExam) {
    try {
      let medicalFolder =
        await this.medicalFolderService.getMedicalFolderByUserId(
          medicalFolderId
        );

      if (!medicalFolder)
        return { status: "failed", body: "medical folder doesn't exist" };
      let createdMedicalExam = await medicalFolder.$create(
        "medicalExam",
        medicalExam
      );

      return { status: "success", body: createdMedicalExam };
    } catch (err) {
      console.log(error(err.message));
      return { status: "failed", body: "an error occured , please try later" };
    }
  }

  async delete(medicalExamId: number) {
    try {
      let medicalExam = await this.medicalExamRepository.findByPk(
        medicalExamId
      );
      if (!medicalExamId)
        return { status: "failed", body: "medical exam doesn't exist" };
      await medicalExam.destroy();
      return { status: "success", body: "medical exam deleted successfully" };
    } catch (err) {
      console.log(error(err.message));
      return { status: "failed", body: "an error occured , please try later" };
    }
  }

  async get(medicalExamId: number) {
    try {
      let medicalExam = await this.medicalExamRepository.findByPk(
        medicalExamId
      );
      if (!medicalExamId)
        return { status: "failed", body: "medical exam doesn't exist" };

      return { status: "success", body: medicalExam };
    } catch (err) {
      console.log(error(err.message));
      return { status: "failed", body: "an error occured , please try later" };
    }
  }
}
