import { Migration } from '@mikro-orm/migrations';

export class Migration20240813031045 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "migrations" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "migrations" ("id" serial primary key, "name" varchar(255) null, "executed_at" timestamptz(6) null default CURRENT_TIMESTAMP);');
  }

}
