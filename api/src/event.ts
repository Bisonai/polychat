import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { EventEmitter } from "events";
import { fromEvent } from "rxjs";
import { IChannelUpldatedId } from "./common/types";

@Injectable()
export class EventsService {
  private readonly emitter: EventEmitter2;
  constructor() {
    this.emitter = new EventEmitter2();
    // Inject some Service here and everything about SSE will stop to work.
  }

  subscribe(channelName: string) {
    return fromEvent(this.emitter, channelName);
  }

  subscribeChannel(channelName: string, _id: number) {
    console.log(`${channelName}-${_id}`);
    return fromEvent(this.emitter, `${channelName}-${_id}`);
  }

  emit(channelName, id) {
    const payload = {
      data: { id },
    };

    this.emitter.emit(channelName, payload);
  }

  emitChannel(channelName, id, channelId) {
    const payload = {
      data: { channelId, id },
    };
    console.log("emited:", `${channelName}-${channelId}`);
    this.emitter.emit(`${channelName}-${channelId}`, payload);
  }
}
