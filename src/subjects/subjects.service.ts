import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const createdSubject = new this.subjectModel(createSubjectDto);
    return createdSubject.save();
  }

  // Updated method to populate topics
  async findAll(): Promise<Subject[]> {
    return this.subjectModel.find().populate('topics').exec();
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findById(id).populate('topics').exec();
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async findByName(name: string): Promise<Subject> {
    const subject = await this.subjectModel.findOne({ name }).populate('topics').exec();
    if (!subject) {
      throw new NotFoundException(`Subject with name ${name} not found`);
    }
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.subjectModel.findByIdAndUpdate(id, updateSubjectDto, { new: true }).populate('topics').exec();
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async remove(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findByIdAndDelete(id).exec();
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }
}