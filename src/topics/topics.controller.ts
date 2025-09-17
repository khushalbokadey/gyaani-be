import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  async create(@Body() createTopicDto: CreateTopicDto) {
    const topic = await this.topicsService.create(createTopicDto);
    return {
      success: true,
      data: topic
    };
  }

  @Get()
  async findAll() {
    const topics = await this.topicsService.findAll();
    return {
      success: true,
      data: topics
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const topic = await this.topicsService.findOne(id);
    return {
      success: true,
      data: topic
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    const topic = await this.topicsService.update(id, updateTopicDto);
    return {
      success: true,
      data: topic
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const topic = await this.topicsService.remove(id);
    return {
      success: true,
      data: topic
    };
  }
}