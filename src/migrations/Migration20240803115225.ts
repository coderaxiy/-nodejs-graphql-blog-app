import { Migration } from '@mikro-orm/migrations';

export class Migration20240803115225 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "first_name" text not null, "last_name" text null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('alter table "post" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "post" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "post" alter column "updated_at" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');

    this.addSql('alter table "post" alter column "created_at" type date(0) using ("created_at"::date(0));');
    this.addSql('alter table "post" alter column "updated_at" type date(0) using ("updated_at"::date(0));');
    this.addSql('alter table "post" alter column "updated_at" set not null;');
  }

}
