import { Migration } from '@mikro-orm/migrations';

export class Migration20240813032910 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "tags" varchar(255) null;');
    this.addSql('alter table "user" rename column "bio" to "about";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "tags";');

    this.addSql('alter table "user" rename column "about" to "bio";');
  }

}
