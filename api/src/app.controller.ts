import { Controller, Get, Param, Request, Sse } from "@nestjs/common";
import { AppService } from "./app.service";
import { EventsService } from "./event";
import { Observable } from "rxjs";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventsService: EventsService
  ) {}

  @Get("/health")
  health(): string {
    return this.appService.health();
  }
  @Get("/test")
  test() {
    this.appService.sendNotification("asdf", "asdf");
  }

  @Sse("/subscribe/list")
  async subscribeListEvent() {
    return this.eventsService.subscribe("list");
  }

  @Sse("/subscribe/channel/:id")
  subscribeChannelEvent(@Param("id") id: number) {
    return this.eventsService.subscribeChannel("channel", id);
  }
}
