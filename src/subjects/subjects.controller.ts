import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { TopicsService } from '../topics/topics.service';

@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly topicsService: TopicsService,
  ) {}

  @Get()
  async findAll() {
    const subjects = await this.subjectsService.findAll();
    
    // Get topics for each subject
    const subjectsWithTopics = await Promise.all(
      subjects.map(async (subject) => {
        const topics = await this.topicsService.findBySubject(subject._id.toString());
        return {
          _id: subject._id,
          name: subject.name,
          color: subject.color,
          totalTopics: topics.length,
          completedTopics: topics.filter(topic => topic.progress === 100).length,
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
            ...(topic.isLocked && { isLocked: topic.isLocked })
          }))
        };
      })
    );

    return {
      success: true,
      data: subjectsWithTopics
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const subject = await this.subjectsService.findOne(id);
    return {
      success: true,
      data: subject
    };
  }

  @Get(':name/topics')
  async getSubjectTopics(@Param('name') name: string) {
    // Find subject by name
    const subject = await this.subjectsService.findByName(name);
    
    // Get topics for this subject
    const topics = await this.topicsService.findBySubject(subject._id.toString());
    
    return {
      success: true,
      data: {
        id: 1,
        name: subject.name,
        progress: subject.progress,
        totalTopics: topics.length,
        completedTopics: topics.filter(t => t.progress === 100).length,
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
          ...(topic.isLocked && { isLocked: topic.isLocked })
        }))
      }
    };
  }

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    const subject = await this.subjectsService.create(createSubjectDto);
    return {
      success: true,
      data: subject
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectsService.update(id, updateSubjectDto);
    return {
      success: true,
      data: subject
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const subject = await this.subjectsService.remove(id);
    return {
      success: true,
      data: subject
    };
  }
}