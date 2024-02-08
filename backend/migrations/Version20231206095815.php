<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231206095815 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE session_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE session (id INT NOT NULL, student_id INT NOT NULL, instructor_id INT NOT NULL, service_id INT NOT NULL, agency_id INT NOT NULL, start_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, status VARCHAR(30) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D044D5D4CB944F1A ON session (student_id)');
        $this->addSql('CREATE INDEX IDX_D044D5D48C4FC193 ON session (instructor_id)');
        $this->addSql('CREATE INDEX IDX_D044D5D4ED5CA9E6 ON session (service_id)');
        $this->addSql('CREATE INDEX IDX_D044D5D4CDEADB2A ON session (agency_id)');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D4CB944F1A FOREIGN KEY (student_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D48C4FC193 FOREIGN KEY (instructor_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D4ED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D4CDEADB2A FOREIGN KEY (agency_id) REFERENCES agency (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE session_id_seq CASCADE');
        $this->addSql('ALTER TABLE session DROP CONSTRAINT FK_D044D5D4CB944F1A');
        $this->addSql('ALTER TABLE session DROP CONSTRAINT FK_D044D5D48C4FC193');
        $this->addSql('ALTER TABLE session DROP CONSTRAINT FK_D044D5D4ED5CA9E6');
        $this->addSql('ALTER TABLE session DROP CONSTRAINT FK_D044D5D4CDEADB2A');
        $this->addSql('DROP TABLE session');
    }
}
