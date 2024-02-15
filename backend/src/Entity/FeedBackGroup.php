<?php

namespace App\Entity;

use App\Repository\FeedBackGroupRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FeedBackGroupRepository::class)]
class FeedBackGroup
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['create-feedback', 'feed_backs:read:collection:by_feed_back_builder'])]
    private ?string $question = null;

    #[ORM\Column(length: 255)]
    #[Groups(['create-feedback', 'feed_backs:read:collection:by_feed_back_builder'])]
    private ?string $answer = null;

    #[ORM\ManyToOne(inversedBy: 'feedBackGroups', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?FeedBack $feedBack = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestion(): ?string
    {
        return $this->question;
    }

    public function setQuestion(string $question): static
    {
        $this->question = $question;

        return $this;
    }

    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(string $answer): static
    {
        $this->answer = $answer;

        return $this;
    }

    public function getFeedBack(): ?FeedBack
    {
        return $this->feedBack;
    }

    public function setFeedBack(?FeedBack $feedBack): static
    {
        $this->feedBack = $feedBack;

        return $this;
    }
}
