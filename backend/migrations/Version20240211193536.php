<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240211193536 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE feed_back_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE feed_back_group_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE feed_back (id INT NOT NULL, client_id INT DEFAULT NULL, company_id INT DEFAULT NULL, feed_back_builder_id INT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_ED592A6019EB6921 ON feed_back (client_id)');
        $this->addSql('CREATE INDEX IDX_ED592A60979B1AD6 ON feed_back (company_id)');
        $this->addSql('CREATE INDEX IDX_ED592A60385B5420 ON feed_back (feed_back_builder_id)');
        $this->addSql('COMMENT ON COLUMN feed_back.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE feed_back_group (id INT NOT NULL, feed_back_id INT NOT NULL, question VARCHAR(255) NOT NULL, answer VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_7342937D534A2B85 ON feed_back_group (feed_back_id)');
        $this->addSql('ALTER TABLE feed_back ADD CONSTRAINT FK_ED592A6019EB6921 FOREIGN KEY (client_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE feed_back ADD CONSTRAINT FK_ED592A60979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE feed_back ADD CONSTRAINT FK_ED592A60385B5420 FOREIGN KEY (feed_back_builder_id) REFERENCES feed_back_builder (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE feed_back_group ADD CONSTRAINT FK_7342937D534A2B85 FOREIGN KEY (feed_back_id) REFERENCES feed_back (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE feed_back_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE feed_back_group_id_seq CASCADE');
        $this->addSql('ALTER TABLE feed_back DROP CONSTRAINT FK_ED592A6019EB6921');
        $this->addSql('ALTER TABLE feed_back DROP CONSTRAINT FK_ED592A60979B1AD6');
        $this->addSql('ALTER TABLE feed_back DROP CONSTRAINT FK_ED592A60385B5420');
        $this->addSql('ALTER TABLE feed_back_group DROP CONSTRAINT FK_7342937D534A2B85');
        $this->addSql('DROP TABLE feed_back');
        $this->addSql('DROP TABLE feed_back_group');
    }
}
