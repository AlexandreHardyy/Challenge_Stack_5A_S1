<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240210230632 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE media_object_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE password_token_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE media_object (id INT NOT NULL, agency_id INT DEFAULT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_14D43132CDEADB2A ON media_object (agency_id)');
        $this->addSql('CREATE TABLE password_token (id INT NOT NULL, user_id INT NOT NULL, token VARCHAR(50) NOT NULL, expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_BEAB6C245F37A13B ON password_token (token)');
        $this->addSql('CREATE INDEX IDX_BEAB6C24A76ED395 ON password_token (user_id)');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D43132CDEADB2A FOREIGN KEY (agency_id) REFERENCES agency (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE password_token ADD CONSTRAINT FK_BEAB6C24A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE company ADD image_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094F3DA5256D FOREIGN KEY (image_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4FBF094F3DA5256D ON company (image_id)');
        $this->addSql('ALTER TABLE schedule_exception ADD status VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE session ADD student_mark DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD image_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D6493DA5256D FOREIGN KEY (image_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D6493DA5256D ON "user" (image_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE company DROP CONSTRAINT FK_4FBF094F3DA5256D');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D6493DA5256D');
        $this->addSql('DROP SEQUENCE media_object_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE password_token_id_seq CASCADE');
        $this->addSql('ALTER TABLE media_object DROP CONSTRAINT FK_14D43132CDEADB2A');
        $this->addSql('ALTER TABLE password_token DROP CONSTRAINT FK_BEAB6C24A76ED395');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP TABLE password_token');
        $this->addSql('ALTER TABLE session DROP student_mark');
        $this->addSql('DROP INDEX UNIQ_8D93D6493DA5256D');
        $this->addSql('ALTER TABLE "user" DROP image_id');
        $this->addSql('ALTER TABLE schedule_exception DROP status');
        $this->addSql('DROP INDEX UNIQ_4FBF094F3DA5256D');
        $this->addSql('ALTER TABLE company DROP image_id');
    }
}
