<?php

namespace App\Entity\Blog;

use App\Entity\Auth\User;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity()]
class Comment
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $content = '';

    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(inversedBy: 'comments')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Publication $post = null;

    #[ORM\ManyToOne(inversedBy: 'comments')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): void
    {
        $this->content = $content;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getPost(): ?Publication
    {
        return $this->post;
    }

    public function setPost(?Publication $post): void
    {
        $this->post = $post;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): void
    {
        $this->author = $author;
    }
}
