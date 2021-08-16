import { Inject, Injectable } from "@nestjs/common";
import { MedicalFolder } from "./medical-folder.entity";

@Injectable()
export class MedicalFolderService {
  constructor(
    @Inject("MedicalFolderRepository")
    private readonly medicalFolderRepository: typeof MedicalFolder,
    @Inject("SequelizeInstance") private readonly sequelizeInstance
  ) {} // private readonly medicalFolderRepository: typeof MedicalFolder // @Inject("MedicalFolderRepository")

  public async create(userId: number) {
    console.log("hello world");

    // this.medicalFolderRepository.create({ userId: userId });
  }
  public async updateMedicalFolder(id: number) {
    await this.medicalFolderRepository.create({ userId: id });
  }
}
