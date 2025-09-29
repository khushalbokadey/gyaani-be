import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrentAffairsService } from './current-affairs.service';
import { CreateCurrentAffairsQuestionDto, CreateBulkCurrentAffairsQuestionsDto } from './dto/create-current-affairs-question.dto';
import { UpdateCurrentAffairsQuestionDto } from './dto/update-current-affairs-question.dto';
import { ApiResponse } from '../shared/interfaces/api-response.interface';

@Controller('current-affairs')
export class CurrentAffairsController {
  constructor(private readonly currentAffairsService: CurrentAffairsService) {}

  @Post('questions')
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(
    @Body() createCurrentAffairsQuestionDto: CreateCurrentAffairsQuestionDto,
  ): Promise<ApiResponse<any>> {
    const question = await this.currentAffairsService.create(createCurrentAffairsQuestionDto);
    return {
      success: true,
      data: question,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `create_ca_question_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Post('questions/bulk')
  @HttpCode(HttpStatus.CREATED)
  async createBulkQuestions(
    @Body() createBulkCurrentAffairsQuestionsDto: CreateBulkCurrentAffairsQuestionsDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.currentAffairsService.createBulk(createBulkCurrentAffairsQuestionsDto);
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `create_ca_questions_bulk_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get('questions')
  async findAllQuestions(
    @Query('topicId') topicId?: string,
    @Query('difficulty') difficulty?: string,
    @Query('isActive') isActive?: string,
    @Query('category') category?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ): Promise<ApiResponse<any[]>> {
    const filters: {
      topicId?: string;
      difficulty?: string;
      isActive?: boolean;
      category?: string;
      limit?: number;
      skip?: number;
    } = {};

    if (topicId) filters.topicId = topicId;
    if (difficulty) filters.difficulty = difficulty;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (category) filters.category = category;
    if (limit) filters.limit = parseInt(limit, 10);
    if (skip) filters.skip = parseInt(skip, 10);

    const questions = await this.currentAffairsService.findAll(filters);
    return {
      success: true,
      data: questions,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `get_ca_questions_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get('questions/stats')
  async getQuestionStats(): Promise<ApiResponse<any>> {
    const stats = await this.currentAffairsService.getQuestionStats();
    return {
      success: true,
      data: stats,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `get_ca_question_stats_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get('questions/topic/:topicId')
  async getQuestionsByTopic(
    @Param('topicId') topicId: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ): Promise<ApiResponse<any[]>> {
    const questions = await this.currentAffairsService.findByTopic(
      topicId,
      limit ? parseInt(limit, 10) : 20,
      skip ? parseInt(skip, 10) : 0,
    );
    return {
      success: true,
      data: questions,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `get_ca_questions_by_topic_${topicId}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get('questions/:id')
  async findOneQuestion(@Param('id') id: string): Promise<ApiResponse<any>> {
    const question = await this.currentAffairsService.findOne(id);
    return {
      success: true,
      data: question,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `get_ca_question_${id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Patch('questions/:id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateCurrentAffairsQuestionDto: UpdateCurrentAffairsQuestionDto,
  ): Promise<ApiResponse<any>> {
    const question = await this.currentAffairsService.update(id, updateCurrentAffairsQuestionDto);
    return {
      success: true,
      data: question,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `update_ca_question_${id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Delete('questions/:id')
  async removeQuestion(@Param('id') id: string): Promise<ApiResponse<any>> {
    const question = await this.currentAffairsService.remove(id);
    return {
      success: true,
      data: question,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `delete_ca_question_${id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }
}
