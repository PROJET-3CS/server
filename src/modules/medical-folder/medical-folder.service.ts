import { Inject, Injectable } from "@nestjs/common";
import { MedicalFolder } from "./models/medical-folder.entity";
import { MedicalFolderStatus } from "src/shared/medical-folder-status.enum";
import { Medicament } from "./models/medicament.entity";
import { GeneralIllness } from "./models/general-illness.entity";
import { AllergicReaction } from "./models/allergic-reaction.entity";
import { SurgicalIntervention } from "./models/surgical-intervention.entity";

@Injectable()
export class MedicalFolderService {
  constructor(
    @Inject("MedicalFolderRepository")
    private readonly medicalFolderRepository: typeof MedicalFolder,
    @Inject("MedicamentRepository")
    private readonly medicamentRepository: typeof Medicament,
    @Inject("GeneralIllnessRepository")
    private readonly generalIllnessRepository: typeof GeneralIllness,
    @Inject("AllergicReactionRepository")
    private readonly allergicReactionRepository: typeof AllergicReaction,
    @Inject("SurgicalInterventionRepository")
    private readonly surgicalInterventionRepository: typeof SurgicalIntervention,
    @Inject("SequelizeInstance") private readonly sequelizeInstance
  ) {} // private readonly medicalFolderRepository: typeof MedicalFolder // @Inject("MedicalFolderRepository")

  public async create(userId: number) {
    this.medicalFolderRepository.create({ userId: userId });
  }

  public async getMedicalFolderByUserId(userId: number) {
    return await this.medicalFolderRepository.findOne({
      where: { userId: userId },
    });
  }

  public async activate(userId: number) {
    try {
      let folder = await this.getMedicalFolderByUserId(userId);
      if (!folder)
        return { status: "failed", message: "this folder doesn't exist" };
      if (folder.status === MedicalFolderStatus.enabled)
        return {
          status: "failed",
          message: "this folder is already activated",
        };
      folder.status = MedicalFolderStatus.enabled;
      folder.save();
      return {
        status: "success",
        message: "folder has been activated successfuly",
      };
    } catch (error) {
      return {
        status: "failed",
        message: "an error occured, please try agian later",
      };
    }
  }

  public async archive(userId: number) {
    try {
      let folder = await this.getMedicalFolderByUserId(userId);
      if (!folder)
        return { status: "failed", message: "this folder doesn't exist" };
      if (folder.status === MedicalFolderStatus.archived)
        return { status: "failed", message: "this folder is already archived" };
      folder.status = MedicalFolderStatus.archived;
      folder.save();
      return {
        status: "success",
        message: "folder has been archived successfuly",
      };
    } catch (error) {
      return {
        status: "failed",
        message: "an error occured, please try agian later",
      };
    }
  }

  public async update({ userId, updatedFolder }) {
    try {
      let folder = await this.getMedicalFolderByUserId(userId);
      if (!folder)
        return { status: "failed", message: "this folder doesn't exist" };
      const {
        tall = folder.tall,
        weight = folder.weight,
        blood = folder.blood,
        imc = folder.imc,
        smoker = folder.smoker,
        nbrCigarettes = folder.nbrCigarettes,
        chewer = folder.chewer,
        alcoholic = folder.alcoholic,
        exSmoker = folder.exSmoker,
        other = folder.other,
      } = updatedFolder;
      folder.nbrCigarettes = nbrCigarettes;
      folder.tall = tall;
      folder.blood = blood;
      folder.weight = weight;
      folder.imc = imc;
      folder.smoker = smoker;
      folder.chewer = chewer;
      folder.alcoholic = alcoholic;
      folder.exSmoker = exSmoker;
      folder.other = other;
      folder.save();
      return { status: "success", message: folder };
    } catch (error) {
      return {
        status: "failed",
        message: "an error occured, please try again later",
      };
    }
  }

  public async addMedicament(userId: number, body) {
    try {
      let { medicaments } = body;
      medicaments.map((medicament) =>
        this.medicamentRepository.create({
          medicalFolderId: userId,
          name: medicament,
        })
      );
      return { status: "success", body: "medicaments added successfuly" };
    } catch (error) {
      return { status: "failed", body: "an error occured , please try later" };
    }
  }

  public async addGeneralIllness(userId: number, body) {
    try {
      let { name, description, path } = body;
      let date = new Date().getDate();
      this.generalIllnessRepository.create({
        medicalFolderId: userId,
        name,
        description,
        // date,
        path,
      });

      return { status: "success", body: "general illness added successfuly" };
    } catch (error) {
      return { status: "failed", body: "an error occured , please try later" };
    }
  }

  public async addSurgicalIntervention(userId: number, body) {
    try {
      let { name, description, date, path } = body;

      this.surgicalInterventionRepository.create({
        medicalFolderId: userId,
        name,
        description,
        date,
        path,
      });

      return {
        status: "success",
        body: "surgical intervention added successfuly",
      };
    } catch (error) {
      return { status: "failed", body: "an error occured , please try later" };
    }
  }

  public async addAllergicReaction(userId: number, body) {
    try {
      let { name, description, date, path } = body;

      this.allergicReactionRepository.create({
        medicalFolderId: userId,
        name,
        description,
      });

      return {
        status: "success",
        body: "allergic reaction added successfuly",
      };
    } catch (error) {
      return { status: "failed", body: "an error occured , please try later" };
    }
  }
}
