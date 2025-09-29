import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiResponse } from '../shared/interfaces/api-response.interface';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  async create(
    @Body() createTopicDto: CreateTopicDto,
  ): Promise<ApiResponse<any>> {
    const topic = await this.topicsService.create(createTopicDto);
    return {
      success: true,
      data: topic,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `create_topic_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<any[]>> {
    const topics = await this.topicsService.findAll();
    return {
      success: true,
      data: topics,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `topics_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const topic = await this.topicsService.findOne(id);
    return {
      success: true,
      data: topic,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `topic_${id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<ApiResponse<any>> {
    const topic = await this.topicsService.update(id, updateTopicDto);
    return {
      success: true,
      data: topic,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `update_topic_${id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<any>> {
    const topic = await this.topicsService.remove(id);
    return {
      success: true,
      data: topic,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `delete_topic_${id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }
}
