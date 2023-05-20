import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { PrismaService } from "src/prisma.service";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ApiController],
  providers: [ApiService, PrismaService],
})
export class ApiModule {}
