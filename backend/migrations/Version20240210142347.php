<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240210142347 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE feed_back_builder_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE feed_back_builder (id INT NOT NULL, company_id INT NOT NULL, title VARCHAR(255) NOT NULL, questions JSON NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_E28CD20C979B1AD6 ON feed_back_builder (company_id)');
        $this->addSql('ALTER TABLE feed_back_builder ADD CONSTRAINT FK_E28CD20C979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE feed_back_builder_id_seq CASCADE');
        $this->addSql('ALTER TABLE feed_back_builder DROP CONSTRAINT FK_E28CD20C979B1AD6');
        $this->addSql('DROP TABLE feed_back_builder');
    }
}
