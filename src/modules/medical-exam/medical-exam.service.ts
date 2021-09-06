import { Inject, Injectable } from "@nestjs/common";
import { MedicalFolderService } from "../medical-folder/medical-folder.service";
import { User } from "../users/models/user.entity";
import { MedicalExam } from "./models/medical-exam.entity";
import * as chalk from "chalk";
import { Rescription } from "./models/rescription.entity";

const error = chalk.bold.red;
const warning = chalk.keyword("orange");

@Injectable()
export class MedicalExamService {
  constructor(
    @Inject("MedicalExamRepository")
    private readonly medicalExamRepository: typeof MedicalExam,
    @Inject("RescriptionRepository")
    private readonly rescriptionRepository: typeof Rescription,
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

  async edit(medicalExamId: number, medicalExamUpdated) {
    try {
      let medicalExam = await this.medicalExamRepository.findByPk(
        medicalExamId
      );
      if (!medicalExamId)
        return { status: "failed", body: "medical exam doesn't exist" };
      const {
        pulsation = medicalExam.pulsation,
        tension = medicalExam.tension,
        weight = medicalExam.weight,
        painStart = medicalExam.painStart,
        painPlace = medicalExam.painPlace,
        painIntensity = medicalExam.painIntensity,
        abdominalPerscussion = medicalExam.abdominalPerscussion,
        abdominalParpation = medicalExam.abdominalParpation,
        backs = medicalExam.backs,
        legs = medicalExam.legs,
        head = medicalExam.head,
        eyes = medicalExam.eyes,
        sicknessDetails = medicalExam.sicknessDetails,
        observation = medicalExam.observation,
        conclusion = medicalExam.conclusion,
      } = medicalExamUpdated;

      medicalExam.pulsation = pulsation;
      medicalExam.tension = tension;
      medicalExam.weight = weight;
      medicalExam.painStart = painStart;
      medicalExam.painPlace = painPlace;
      medicalExam.painIntensity = painIntensity;
      medicalExam.abdominalPerscussion = abdominalPerscussion;
      medicalExam.abdominalParpation = abdominalParpation;
      medicalExam.backs = backs;
      medicalExam.legs = legs;
      medicalExam.eyes = eyes;
      medicalExam.head = head;
      medicalExam.sicknessDetails = sicknessDetails;
      medicalExam.observation = observation;
      medicalExam.conclusion = conclusion;
      await medicalExam.save();
      return { status: "succes", body: "medical exam updated successfuly" };
    } catch (err) {
      console.log(error(err.message));
      return { status: "failed", body: "an error occured , please try later" };
    }
  }

  async createRescription(rescription, userId: number) {
    try {
      const medicalFolder =
        await this.medicalFolderService.getMedicalFolderByUserId(userId);
      if (!medicalFolder)
        return { status: "failed", body: "medical folder doesn't exist" };
      const { doctorId, medicalExamId, medicaments } = rescription;

      if (medicalExamId) {
        let medicalExam = await this.medicalExamRepository.findByPk(
          medicalExamId
        );
        if (!medicalExam)
          return { status: "failed", body: "medical exam doesn't exist" };
      }
      let createdRescription = {
        medicalExamId,
        doctorId,
        medicaments,
      };

      await medicalFolder.$create("rescription", createdRescription);

      return {
        status: "success",
        body: "rescription created successfully",
      };
    } catch (err) {
      console.log(error(err.message));
      return { status: "failed", body: "an error occured , please try later" };
    }
  }

  async getRescriptions(queries, page: number, items: number) {
    const results = await this.rescriptionRepository.findAndCountAll({
      where: { ...queries },
      limit: Number(items),
      offset: Number(page) * Number(page),
    });

    const { rows } = results;
    let rescriptions: Rescription[] = [];
    rows.map((row) => {
      row = JSON.parse(JSON.stringify(row));
      row.medicaments = JSON.parse(JSON.parse(row.medicaments));
      rescriptions.push(row);
    });

    return {
      status: "success",
      body: {
        currentPage: Number(page),
        totalPages: Math.ceil(results.count / Number(items)),
        count: results.count,
        rescriptions,
      },
    };
  }
}
