import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from './schemas/topic.schema';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const createdTopic = new this.topicModel(createTopicDto);
    return createdTopic.save();
  }

  async findAll(): Promise<Topic[]> {
    return this.topicModel.find().exec();
  }

  async findBySubject(subjectId: string): Promise<Topic[]> {
    return this.topicModel.find({ subjectId }).exec();
  }

  async findOne(id: string): Promise<Topic> {
    const topic = await this.topicModel.findById(id).exec();
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.topicModel.findByIdAndUpdate(id, updateTopicDto, { new: true }).exec();
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return topic;
  }

  async remove(id: string): Promise<Topic> {
    const topic = await this.topicModel.findByIdAndDelete(id).exec();
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return topic;
  }
}