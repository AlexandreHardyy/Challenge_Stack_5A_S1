<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240211120755 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE rating_service_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE rating_service (id INT NOT NULL, service_id INT NOT NULL, session_id INT NOT NULL, rating SMALLINT NOT NULL, comment VARCHAR(1000) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2D163AAED5CA9E6 ON rating_service (service_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2D163AA613FECDF ON rating_service (session_id)');
        $this->addSql('ALTER TABLE rating_service ADD CONSTRAINT FK_2D163AAED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE rating_service ADD CONSTRAINT FK_2D163AA613FECDF FOREIGN KEY (session_id) REFERENCES session (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE rating_service_id_seq CASCADE');
        $this->addSql('ALTER TABLE rating_service DROP CONSTRAINT FK_2D163AAED5CA9E6');
        $this->addSql('ALTER TABLE rating_service DROP CONSTRAINT FK_2D163AA613FECDF');
        $this->addSql('DROP TABLE rating_service');
    }
}
