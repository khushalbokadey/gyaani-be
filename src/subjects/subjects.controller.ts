import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ApiResponse } from '../shared/interfaces/api-response.interface';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async findAll(): Promise<ApiResponse<any[]>> {
    const subjects = await this.subjectsService.findAllWithTopics();
    return {
      success: true,
      data: subjects,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `subjects_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const subject = await this.subjectsService.findOne(id);
    return {
      success: true,
      data: subject,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `subject_${id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get(':name/topics')
  async getSubjectTopics(
    @Param('name') name: string,
  ): Promise<ApiResponse<any>> {
    const subjectWithTopics =
      await this.subjectsService.findByNameWithTopics(name);
    return {
      success: true,
      data: subjectWithTopics,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `subject_topics_${name}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Post()
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<ApiResponse<any>> {
    const subject = await this.subjectsService.create(createSubjectDto);
    return {
      success: true,
      data: subject,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `create_subject_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<ApiResponse<any>> {
    const subject = await this.subjectsService.update(id, updateSubjectDto);
    return {
      success: true,
      data: subject,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `update_subject_${id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<any>> {
    const subject = await this.subjectsService.remove(id);
    return {
      success: true,
      data: subject,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `delete_subject_${id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }
}
