import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";

import { ScheduleModule } from "@nestjs/schedule";
import { ApiModule } from "./api/api.module";
import { PrismaService } from "nestjs-prisma";

@Module({
  imports: [ScheduleModule.forRoot(), ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
