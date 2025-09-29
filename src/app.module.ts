import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TopicsModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';
import { CurrentAffairsModule } from './current-affairs/current-affairs.module';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    SubjectsModule,
    TopicsModule,
    UsersModule,
    CurrentAffairsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
