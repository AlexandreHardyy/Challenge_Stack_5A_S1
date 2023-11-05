<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231101180810 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE location_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE agency_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE agency (id INT NOT NULL, company_id INT NOT NULL, adresse VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, zip VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_70C0C6E6979B1AD6 ON agency (company_id)');
        $this->addSql('COMMENT ON COLUMN agency.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN agency.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE agency ADD CONSTRAINT FK_70C0C6E6979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE location DROP CONSTRAINT fk_5e9e89cb979b1ad6');
        $this->addSql('DROP TABLE location');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE agency_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE location_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE location (id INT NOT NULL, company_id INT NOT NULL, adresse VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, zip VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_5e9e89cb979b1ad6 ON location (company_id)');
        $this->addSql('COMMENT ON COLUMN location.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN location.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE location ADD CONSTRAINT fk_5e9e89cb979b1ad6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE agency DROP CONSTRAINT FK_70C0C6E6979B1AD6');
        $this->addSql('DROP TABLE agency');
    }
}
