<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240212095301 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE feed_back ADD session_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE feed_back ADD CONSTRAINT FK_ED592A60613FECDF FOREIGN KEY (session_id) REFERENCES session (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_ED592A60613FECDF ON feed_back (session_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE feed_back DROP CONSTRAINT FK_ED592A60613FECDF');
        $this->addSql('DROP INDEX UNIQ_ED592A60613FECDF');
        $this->addSql('ALTER TABLE feed_back DROP session_id');
    }
}
