import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from './schemas/topic.schema';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { NotFoundError } from '../shared/errors/application.error';
import { LoggerService } from '../core/logging/logger.service';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    private readonly logger: LoggerService,
  ) {}

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    try {
      this.logger.log(`Creating topic: ${createTopicDto.name}`);
      const createdTopic = new this.topicModel(createTopicDto);
      const savedTopic = await createdTopic.save();
      this.logger.log(`Topic created successfully: ${savedTopic._id}`);
      return savedTopic;
    } catch (error) {
      this.logger.error('Error creating topic', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  async findAll(): Promise<Topic[]> {
    try {
      this.logger.log('Fetching all topics');
      return this.topicModel.find().exec();
    } catch (error) {
      this.logger.error('Error fetching topics', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  async findBySubject(subjectId: string): Promise<Topic[]> {
    try {
      this.logger.log(`Fetching topics for subject: ${subjectId}`);
      return this.topicModel.find({ subjectId }).exec();
    } catch (error) {
      this.logger.error(`Error fetching topics for subject ${subjectId}`, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  async findOne(id: string): Promise<Topic> {
    try {
      this.logger.log(`Fetching topic: ${id}`);
      const topic = await this.topicModel.findById(id).exec();
      if (!topic) {
        throw new NotFoundError(`Topic with ID ${id} not found`);
      }
      return topic;
    } catch (error) {
      this.logger.error(`Error fetching topic ${id}`, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    try {
      this.logger.log(`Updating topic: ${id}`);
      const topic = await this.topicModel.findByIdAndUpdate(id, updateTopicDto, { new: true }).exec();
      if (!topic) {
        throw new NotFoundError(`Topic with ID ${id} not found`);
      }
      this.logger.log(`Topic updated successfully: ${id}`);
      return topic;
    } catch (error) {
      this.logger.error(`Error updating topic ${id}`, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  async remove(id: string): Promise<Topic> {
    try {
      this.logger.log(`Removing topic: ${id}`);
      const topic = await this.topicModel.findByIdAndDelete(id).exec();
      if (!topic) {
        throw new NotFoundError(`Topic with ID ${id} not found`);
      }
      this.logger.log(`Topic removed successfully: ${id}`);
      return topic;
    } catch (error) {
      this.logger.error(`Error removing topic ${id}`, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }
}