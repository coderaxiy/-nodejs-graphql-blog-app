import { Migration } from "@mikro-orm/migrations";

export class Migration20240805164138 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "post" add column "description" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop column "description";');
  }
}
