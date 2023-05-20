import { Injectable, Logger } from "@nestjs/common";
import { Client } from "pg";

@Injectable()
export class AppService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      connectionString:
        "postgresql://bisonai:qlthskdl12@polygon-cinder-database-rds.c4fxu3k4a1gu.ap-southeast-1.rds.amazonaws.com:5432/cinder?schema=public",
    });

    this.client.connect((err) => {
      if (err) {
        console.error("Error connecting to PostgreSQL:", err);
      } else {
        console.log("Connected to PostgreSQL");
        this.startListening();
      }
    });
  }

  private startListening() {
    this.client.query("LISTEN notification");

    this.client.on("notification", (notification) => {
      const payload = notification.payload;
      console.log("Received notification:", payload);
      // Handle the notification payload as needed
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
