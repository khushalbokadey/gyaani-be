import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrentAffairsQuestion, CurrentAffairsQuestionDocument } from './schemas/current-affairs-question.schema';
import { CreateCurrentAffairsQuestionDto, CreateBulkCurrentAffairsQuestionsDto } from './dto/create-current-affairs-question.dto';
import { UpdateCurrentAffairsQuestionDto } from './dto/update-current-affairs-question.dto';
import { LoggerService } from '../core/logging/logger.service';

@Injectable()
export class CurrentAffairsService {
  constructor(
    @InjectModel(CurrentAffairsQuestion.name)
    private readonly currentAffairsQuestionModel: Model<CurrentAffairsQuestionDocument>,
    private readonly logger: LoggerService,
  ) {}

  async create(createCurrentAffairsQuestionDto: CreateCurrentAffairsQuestionDto): Promise<CurrentAffairsQuestion> {
    try {
      this.logger.log(`Creating current affairs question: ${createCurrentAffairsQuestionDto.question.substring(0, 50)}...`);
      
      // Validate that exactly one option is correct
      const correctAnswers = createCurrentAffairsQuestionDto.options.filter(option => option.isCorrect).length;
      if (correctAnswers !== 1) {
        throw new BadRequestException('Exactly one option must be marked as correct');
      }

      const createdQuestion = new this.currentAffairsQuestionModel(createCurrentAffairsQuestionDto);
      const savedQuestion = await createdQuestion.save();
      
      this.logger.log(`Current affairs question created successfully: ${savedQuestion._id}`);
      return savedQuestion;
    } catch (error) {
      this.logger.error(
        'Error creating current affairs question',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async createBulk(createBulkCurrentAffairsQuestionsDto: CreateBulkCurrentAffairsQuestionsDto): Promise<{
    created: CurrentAffairsQuestion[];
    failed: Array<{ question: CreateCurrentAffairsQuestionDto; error: string }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  }> {
    try {
      this.logger.log(`Creating ${createBulkCurrentAffairsQuestionsDto.questions.length} current affairs questions in bulk`);
      
      const results = {
        created: [] as CurrentAffairsQuestion[],
        failed: [] as Array<{ question: CreateCurrentAffairsQuestionDto; error: string }>,
        summary: {
          total: createBulkCurrentAffairsQuestionsDto.questions.length,
          successful: 0,
          failed: 0,
        },
      };

      // Process each question
      for (const questionDto of createBulkCurrentAffairsQuestionsDto.questions) {
        try {
          // Validate that exactly one option is correct
          const correctAnswers = questionDto.options.filter(option => option.isCorrect).length;
          if (correctAnswers !== 1) {
            throw new BadRequestException('Exactly one option must be marked as correct');
          }

          const createdQuestion = new this.currentAffairsQuestionModel(questionDto);
          const savedQuestion = await createdQuestion.save();
          results.created.push(savedQuestion);
          results.summary.successful++;
          
          this.logger.log(`Bulk question created successfully: ${savedQuestion._id}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          results.failed.push({
            question: questionDto,
            error: errorMessage,
          });
          results.summary.failed++;
          
          this.logger.error(`Failed to create bulk question: ${questionDto.question.substring(0, 50)}...`, errorMessage);
        }
      }

      this.logger.log(`Bulk creation completed: ${results.summary.successful} successful, ${results.summary.failed} failed`);
      return results;
    } catch (error) {
      this.logger.error(
        'Error in bulk creating current affairs questions',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findAll(filters?: {
    topicId?: string;
    difficulty?: string;
    isActive?: boolean;
    category?: string;
    limit?: number;
    skip?: number;
  }): Promise<CurrentAffairsQuestion[]> {
    try {
      this.logger.log('Fetching current affairs questions with filters', { metadata: { filters } });
      
      const query: any = {};
      
      if (filters?.topicId) {
        query.topicId = filters.topicId;
      }
      
      if (filters?.difficulty) {
        query.difficulty = filters.difficulty;
      }
      
      if (filters?.isActive !== undefined) {
        query.isActive = filters.isActive;
      }
      
      if (filters?.category) {
        query.category = filters.category;
      }

      const questions = await this.currentAffairsQuestionModel
        .find(query)
        .sort({ eventDate: -1, createdAt: -1 })
        .skip(filters?.skip || 0)
        .limit(filters?.limit || 100)
        .exec();

      this.logger.log(`Found ${questions.length} current affairs questions`);
      return questions;
    } catch (error) {
      this.logger.error(
        'Error fetching current affairs questions',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<CurrentAffairsQuestion> {
    try {
      this.logger.log(`Fetching current affairs question: ${id}`);
      
      const question = await this.currentAffairsQuestionModel.findById(id).exec();
      
      if (!question) {
        throw new NotFoundException(`Current affairs question with ID ${id} not found`);
      }

      this.logger.log(`Current affairs question found: ${id}`);
      return question;
    } catch (error) {
      this.logger.error(
        'Error fetching current affairs question',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async update(id: string, updateCurrentAffairsQuestionDto: UpdateCurrentAffairsQuestionDto): Promise<CurrentAffairsQuestion> {
    try {
      this.logger.log(`Updating current affairs question: ${id}`);
      
      // If options are being updated, validate them
      if (updateCurrentAffairsQuestionDto.options) {
        const correctAnswers = updateCurrentAffairsQuestionDto.options.filter(option => option.isCorrect).length;
        if (correctAnswers !== 1) {
          throw new BadRequestException('Exactly one option must be marked as correct');
        }
      }

      const updatedQuestion = await this.currentAffairsQuestionModel
        .findByIdAndUpdate(id, updateCurrentAffairsQuestionDto, { new: true })
        .exec();

      if (!updatedQuestion) {
        throw new NotFoundException(`Current affairs question with ID ${id} not found`);
      }

      this.logger.log(`Current affairs question updated successfully: ${id}`);
      return updatedQuestion;
    } catch (error) {
      this.logger.error(
        'Error updating current affairs question',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async remove(id: string): Promise<CurrentAffairsQuestion> {
    try {
      this.logger.log(`Deleting current affairs question: ${id}`);
      
      const deletedQuestion = await this.currentAffairsQuestionModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedQuestion) {
        throw new NotFoundException(`Current affairs question with ID ${id} not found`);
      }

      this.logger.log(`Current affairs question deleted successfully: ${id}`);
      return deletedQuestion;
    } catch (error) {
      this.logger.error(
        'Error deleting current affairs question',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findByTopic(topicId: string, limit: number = 20, skip: number = 0): Promise<CurrentAffairsQuestion[]> {
    try {
      this.logger.log(`Fetching current affairs questions for topic: ${topicId}`);
      
      const questions = await this.currentAffairsQuestionModel
        .find({ topicId, isActive: true })
        .sort({ eventDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      this.logger.log(`Found ${questions.length} current affairs questions for topic: ${topicId}`);
      return questions;
    } catch (error) {
      this.logger.error(
        'Error fetching current affairs questions by topic',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async getQuestionStats(): Promise<{
    total: number;
    byDifficulty: { easy: number; medium: number; hard: number };
    byTopic: Record<string, number>;
  }> {
    try {
      this.logger.log('Fetching current affairs question statistics');
      
      const total = await this.currentAffairsQuestionModel.countDocuments({ isActive: true });
      
      const byDifficulty = await this.currentAffairsQuestionModel.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      ]);
      
      const byTopic = await this.currentAffairsQuestionModel.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$topicId', count: { $sum: 1 } } },
      ]);

      const difficultyStats = {
        easy: byDifficulty.find(d => d._id === 'easy')?.count || 0,
        medium: byDifficulty.find(d => d._id === 'medium')?.count || 0,
        hard: byDifficulty.find(d => d._id === 'hard')?.count || 0,
      };

      const topicStats = byTopic.reduce((acc, item) => {
        acc[item._id.toString()] = item.count;
        return acc;
      }, {} as Record<string, number>);

      this.logger.log(`Current affairs question statistics: ${total} total questions`);
      return {
        total,
        byDifficulty: difficultyStats,
        byTopic: topicStats,
      };
    } catch (error) {
      this.logger.error(
        'Error fetching current affairs question statistics',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
