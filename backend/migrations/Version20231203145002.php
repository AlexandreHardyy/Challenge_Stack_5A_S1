<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231203145002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_agency (user_id INT NOT NULL, agency_id INT NOT NULL, PRIMARY KEY(user_id, agency_id))');
        $this->addSql('CREATE INDEX IDX_1592DDDBA76ED395 ON user_agency (user_id)');
        $this->addSql('CREATE INDEX IDX_1592DDDBCDEADB2A ON user_agency (agency_id)');
        $this->addSql('ALTER TABLE user_agency ADD CONSTRAINT FK_1592DDDBA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_agency ADD CONSTRAINT FK_1592DDDBCDEADB2A FOREIGN KEY (agency_id) REFERENCES agency (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE user_agency DROP CONSTRAINT FK_1592DDDBA76ED395');
        $this->addSql('ALTER TABLE user_agency DROP CONSTRAINT FK_1592DDDBCDEADB2A');
        $this->addSql('DROP TABLE user_agency');
    }
}
