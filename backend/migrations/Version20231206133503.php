<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231206133503 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE schedule_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE schedule_exception_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE schedule (id INT NOT NULL, agency_id INT NOT NULL, employee_id INT NOT NULL, date DATE NOT NULL, start_hour INT NOT NULL, end_hour INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_5A3811FBCDEADB2A ON schedule (agency_id)');
        $this->addSql('CREATE INDEX IDX_5A3811FB8C03F15C ON schedule (employee_id)');
        $this->addSql('CREATE TABLE schedule_exception (id INT NOT NULL, schedule_id INT NOT NULL, start_hour INT NOT NULL, end_hour INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B0CFF01DA40BC2D5 ON schedule_exception (schedule_id)');
        $this->addSql('ALTER TABLE schedule ADD CONSTRAINT FK_5A3811FBCDEADB2A FOREIGN KEY (agency_id) REFERENCES agency (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE schedule ADD CONSTRAINT FK_5A3811FB8C03F15C FOREIGN KEY (employee_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE schedule_exception ADD CONSTRAINT FK_B0CFF01DA40BC2D5 FOREIGN KEY (schedule_id) REFERENCES schedule (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE schedule_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE schedule_exception_id_seq CASCADE');
        $this->addSql('ALTER TABLE schedule DROP CONSTRAINT FK_5A3811FBCDEADB2A');
        $this->addSql('ALTER TABLE schedule DROP CONSTRAINT FK_5A3811FB8C03F15C');
        $this->addSql('ALTER TABLE schedule_exception DROP CONSTRAINT FK_B0CFF01DA40BC2D5');
        $this->addSql('DROP TABLE schedule');
        $this->addSql('DROP TABLE schedule_exception');
    }
}
