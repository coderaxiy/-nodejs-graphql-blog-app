import { Migration } from '@mikro-orm/migrations';

export class Migration20240813033415 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bio" ("id" serial primary key, "year" timestamptz not null, "description" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "bio" cascade;');
  }

}
