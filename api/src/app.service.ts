import { Injectable, Logger } from "@nestjs/common";
import { Client } from "pg";
import { EventEmitter } from "events";
import { EventsService } from "./event";

@Injectable()
export class AppService {
  private readonly client: Client;
  private readonly emitter: EventEmitter;

  constructor(private eventService: EventsService) {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    this.client.connect((err) => {
      if (err) {
        console.error("Error connecting to PostgreSQL:", err);
      } else {
        console.log("Connected to PostgreSQL");
        this.startListListening();
      }
    });
  }

  startListListening(): any {
    this.client.query("LISTEN list");
    this.client.query("LISTEN channel");
    this.client.on("notification", (notification) => {
      const payload = JSON.parse(notification.payload);
      switch (payload.type) {
        case "list":
          console.log("Received list notification:", payload.id);
          this.eventService.emit("list", payload.id);
          break;
        case "channel":
          console.log("Received channel notification:", payload.id);
          this.eventService.emitChannel(
            "channel",
            payload.id,
            payload.channel_id
          );
          break;
        default:
      }
    });
  }

  // Method to send notifications
  sendNotification(channel: string, payload: any) {
    const notification = {
      channel: channel,
      payload: JSON.stringify(payload),
    };

    this.client.query(`NOTIFY notification, "${payload}"`);
  }

  // Cleanup the connection
  async close() {
    await this.client.end();
    console.log("Disconnected from PostgreSQL");
  }

  health(): string {
    return "ok";
  }
}
