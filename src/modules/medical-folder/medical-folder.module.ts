import { Module } from '@nestjs/common';
import { MedicalFolderService } from './medical-folder.service';
import { MedicalFolderController } from './medical-folder.controller';

@Module({
  providers: [MedicalFolderService],
  controllers: [MedicalFolderController]
})
export class MedicalFolderModule {}
