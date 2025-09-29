import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { TopicsService } from '../topics/topics.service';
import { NotFoundError } from '../shared/errors/application.error';
import { LoggerService } from '../core/logging/logger.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    private readonly topicsService: TopicsService,
    private readonly logger: LoggerService,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    try {
      this.logger.log(`Creating subject: ${createSubjectDto.name}`);
      const createdSubject = new this.subjectModel(createSubjectDto);
      const savedSubject = await createdSubject.save();
      this.logger.log(`Subject created successfully: ${savedSubject._id}`);
      return savedSubject;
    } catch (error) {
      this.logger.error(
        'Error creating subject',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findAll(): Promise<Subject[]> {
    try {
      this.logger.log('Fetching all subjects');
      return this.subjectModel.find().exec();
    } catch (error) {
      this.logger.error(
        'Error fetching subjects',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findAllWithTopics(): Promise<any[]> {
    try {
      this.logger.log('Fetching all subjects with topics');
      const subjects = await this.subjectModel.find().exec();

      const subjectsWithTopics = await Promise.all(
        subjects.map(async (subject) => {
          const topics = await this.topicsService.findBySubject(
            subject._id.toString(),
          );
          return {
            _id: subject._id,
            name: subject.name,
            color: subject.color,
            totalTopics: topics.length,
            completedTopics: topics.filter((topic) => topic.progress === 100)
              .length,
            progress: subject.progress,
            description: subject.description,
            lastStudied: subject.lastStudied,
            topics: topics.map((topic, index) => ({
              id: index + 1,
              name: topic.name,
              progress: topic.progress,
              difficulty: topic.difficulty,
              estimatedTime: topic.estimatedTime,
              totalLessons: topic.totalLessons,
              completedLessons: topic.completedLessons,
              totalQuestions: topic.totalQuestions,
              description: topic.description,
              ...(topic.isLocked && { isLocked: topic.isLocked }),
            })),
          };
        }),
      );

      return subjectsWithTopics;
    } catch (error) {
      this.logger.error(
        'Error fetching subjects with topics',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Subject> {
    try {
      this.logger.log(`Fetching subject: ${id}`);
      const subject = await this.subjectModel.findById(id).exec();
      if (!subject) {
        throw new NotFoundError(`Subject with ID ${id} not found`);
      }
      return subject;
    } catch (error) {
      this.logger.error(
        `Error fetching subject ${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findByName(name: string): Promise<Subject> {
    try {
      this.logger.log(`Fetching subject by name: ${name}`);
      const subject = await this.subjectModel.findOne({ name }).exec();
      if (!subject) {
        throw new NotFoundError(`Subject with name ${name} not found`);
      }
      return subject;
    } catch (error) {
      this.logger.error(
        `Error fetching subject by name ${name}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findByNameWithTopics(name: string): Promise<any> {
    try {
      this.logger.log(`Fetching subject with topics by name: ${name}`);
      const subject = await this.findByName(name);
      const topics = await this.topicsService.findBySubject(
        subject._id.toString(),
      );

      return {
        id: 1,
        name: subject.name,
        progress: subject.progress,
        totalTopics: topics.length,
        completedTopics: topics.filter((t) => t.progress === 100).length,
        lastStudied: subject.lastStudied,
        color: subject.color,
        topics: topics.map((topic, index) => ({
          id: index + 1,
          name: topic.name,
          progress: topic.progress,
          difficulty: topic.difficulty,
          estimatedTime: topic.estimatedTime,
          totalLessons: topic.totalLessons,
          completedLessons: topic.completedLessons,
          totalQuestions: topic.totalQuestions,
          description: topic.description,
          ...(topic.isLocked && { isLocked: topic.isLocked }),
        })),
      };
    } catch (error) {
      this.logger.error(
        `Error fetching subject with topics by name ${name}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    try {
      this.logger.log(`Updating subject: ${id}`);
      const subject = await this.subjectModel
        .findByIdAndUpdate(id, updateSubjectDto, { new: true })
        .exec();
      if (!subject) {
        throw new NotFoundError(`Subject with ID ${id} not found`);
      }
      this.logger.log(`Subject updated successfully: ${id}`);
      return subject;
    } catch (error) {
      this.logger.error(
        `Error updating subject ${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async remove(id: string): Promise<Subject> {
    try {
      this.logger.log(`Removing subject: ${id}`);
      const subject = await this.subjectModel.findByIdAndDelete(id).exec();
      if (!subject) {
        throw new NotFoundError(`Subject with ID ${id} not found`);
      }
      this.logger.log(`Subject removed successfully: ${id}`);
      return subject;
    } catch (error) {
      this.logger.error(
        `Error removing subject ${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
