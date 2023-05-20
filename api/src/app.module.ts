import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";

import { ScheduleModule } from "@nestjs/schedule";
import { ApiModule } from "./api/api.module";
import { EventsService } from "./event";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [ScheduleModule.forRoot(), EventEmitterModule.forRoot(), ApiModule],
  controllers: [AppController],
  providers: [AppService, EventsService],
})
export class AppModule {}
