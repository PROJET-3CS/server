import { Inject, Injectable } from '@nestjs/common';
import { MedicalFolderService } from '../medical-folder/medical-folder.service';
import { User } from '../users/models/user.entity';
import { MedicalExam } from './models/medical-exam.entity';
import { Rescription } from './models/rescription.entity';
import { MedicalExamDocument } from './models/document.entity';

const chalk = require('chalk');
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

@Injectable()
export class MedicalExamService {
  constructor(
    @Inject('MedicalExamRepository')
    private readonly medicalExamRepository: typeof MedicalExam,
    @Inject('RescriptionRepository')
    private readonly rescriptionRepository: typeof Rescription,
    @Inject('MedicalExamDocumentRepository')
    private readonly medicalExamDocumentRepository: typeof MedicalExamDocument,
    private readonly medicalFolderService: MedicalFolderService
  ) {}

  async create(medicalFolderId: number, medicalExam) {
    try {
      let medicalFolder =
        await this.medicalFolderService.getMedicalFolderByUserId(
          medicalFolderId
        );

      if (!medicalFolder)
        return { status: 'failed', body: "medical folder doesn't exist" };
      let createdMedicalExam = await medicalFolder.$create(
        'medicalExam',
        medicalExam
      );

      return { status: 'success', body: createdMedicalExam };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'an error occured , please try later' };
    }
  }

  async delete(medicalExamId: number) {
    try {
      let medicalExam = await this.medicalExamRepository.findByPk(
        medicalExamId
      );
      if (!medicalExamId)
        return { status: 'failed', body: "medical exam doesn't exist" };
      await medicalExam.destroy();
      return { status: 'success', body: 'medical exam deleted successfully' };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'an error occured , please try later' };
    }
  }

  async get(medicalExamId: number) {
    try {
      let medicalExam = await this.medicalExamRepository.findByPk(
        medicalExamId
      );
      if (!medicalExamId)
        return { status: 'failed', body: "medical exam doesn't exist" };

      return { status: 'success', body: medicalExam };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'an error occured , please try later' };
    }
  }

  async edit(medicalExamId: number, medicalExamUpdated) {
    try {
      let medicalExam = await this.medicalExamRepository.findByPk(
        medicalExamId
      );
      if (!medicalExamId)
        return { status: 'failed', body: "medical exam doesn't exist" };
      const {
        reason = medicalExam.reason,
        painPlace = medicalExam.painPlace,
        intensity = medicalExam.intensity,
        interrogationNote = medicalExam.interrogationNote,
        startedAt = medicalExam.startedAt,
        fever = medicalExam.fever,
        pulsation = medicalExam.pulsation,
        pressure = medicalExam.pressure,
        weight = medicalExam.weight,
        state = medicalExam.state,
        inspection = medicalExam.inspection,
        auscultation = medicalExam.auscultation,
        percussion = medicalExam.percussion,
        palpation = medicalExam.weight,
        diagnosticNote = medicalExam.diagnosticNote,
        conclusion = medicalExam.conclusion,
        filePath = medicalExam.filePath,
      } = medicalExamUpdated;

      medicalExam.reason = reason;
      medicalExam.painPlace = painPlace;
      medicalExam.intensity = intensity;
      medicalExam.interrogationNote = interrogationNote;
      medicalExam.startedAt = startedAt;
      medicalExam.fever = fever;
      medicalExam.pulsation = pulsation;
      medicalExam.pressure = pressure;
      medicalExam.weight = weight;
      medicalExam.state = state;
      medicalExam.inspection = inspection;
      medicalExam.auscultation = auscultation;
      medicalExam.percussion = percussion;
      medicalExam.palpation = palpation;
      medicalExam.diagnosticNote = diagnosticNote;
      medicalExam.filePath = filePath;
      medicalExam.conclusion = conclusion;
      await medicalExam.save();
      return { status: 'succes', body: 'medical exam updated successfuly' };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'an error occured , please try later' };
    }
  }

  async createRescription(rescription, userId: number) {
    try {
      const medicalFolder =
        await this.medicalFolderService.getMedicalFolderByUserId(userId);
      if (!medicalFolder)
        return { status: 'failed', body: "medical folder doesn't exist" };
      const { doctorId, medicalExamId, medicaments } = rescription;

      if (medicalExamId) {
        let medicalExam = await this.medicalExamRepository.findByPk(
          medicalExamId
        );
        if (!medicalExam)
          return { status: 'failed', body: "medical exam doesn't exist" };
      }
      let createdRescription = {
        medicalExamId,
        doctorId,
        medicaments,
      };

      await medicalFolder.$create('rescription', createdRescription);

      return {
        status: 'success',
        body: 'rescription created successfully',
      };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'an error occured , please try later' };
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
      status: 'success',
      body: {
        currentPage: Number(page),
        totalPages: Math.ceil(results.count / Number(items)),
        count: results.count,
        rescriptions,
      },
    };
  }

  async createDocument(document, userId: number) {
    try {
      const medicalFolder =
        await this.medicalFolderService.getMedicalFolderByUserId(userId);
      if (!medicalFolder)
        return { status: 'failed', body: "medical folder doesn't exist" };
      const { doctorId, medicalExamId, type, content } = document;

      if (medicalExamId) {
        let medicalExam = await this.medicalExamRepository.findByPk(
          medicalExamId
        );
        if (!medicalExam)
          return { status: 'failed', body: "medical exam doesn't exist" };
      }
      let createdRescription = {
        medicalExamId,
        doctorId,
        type,
        content,
      };

      await medicalFolder.$create('document', createdRescription);

      return {
        status: 'success',
        body: 'document created successfully',
      };
    } catch (err) {
      console.log(error(err.message));
      return { status: 'failed', body: 'an error occured , please try later' };
    }
  }

  async getDocuments(queries, page: number, items: number) {
    const results = await this.medicalExamRepository.findAndCountAll({
      where: { ...queries },
      limit: Number(items),
      offset: Number(page) * Number(page),
    });

    return {
      status: 'success',
      body: {
        currentPage: Number(page),
        totalPages: Math.ceil(results.count / Number(items)),
        count: results.count,
        documents: results.rows,
      },
    };
  }
}
