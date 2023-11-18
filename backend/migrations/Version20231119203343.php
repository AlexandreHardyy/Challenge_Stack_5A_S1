<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231119203343 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE service_agency (service_id INT NOT NULL, agency_id INT NOT NULL, PRIMARY KEY(service_id, agency_id))');
        $this->addSql('CREATE INDEX IDX_4E07C3D0ED5CA9E6 ON service_agency (service_id)');
        $this->addSql('CREATE INDEX IDX_4E07C3D0CDEADB2A ON service_agency (agency_id)');
        $this->addSql('ALTER TABLE service_agency ADD CONSTRAINT FK_4E07C3D0ED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE service_agency ADD CONSTRAINT FK_4E07C3D0CDEADB2A FOREIGN KEY (agency_id) REFERENCES agency (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE service DROP CONSTRAINT fk_e19d9ad2cdeadb2a');
        $this->addSql('DROP INDEX idx_e19d9ad2cdeadb2a');
        $this->addSql('ALTER TABLE service DROP agency_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE service_agency DROP CONSTRAINT FK_4E07C3D0ED5CA9E6');
        $this->addSql('ALTER TABLE service_agency DROP CONSTRAINT FK_4E07C3D0CDEADB2A');
        $this->addSql('DROP TABLE service_agency');
        $this->addSql('ALTER TABLE service ADD agency_id INT NOT NULL');
        $this->addSql('ALTER TABLE service ADD CONSTRAINT fk_e19d9ad2cdeadb2a FOREIGN KEY (agency_id) REFERENCES agency (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_e19d9ad2cdeadb2a ON service (agency_id)');
    }
}
