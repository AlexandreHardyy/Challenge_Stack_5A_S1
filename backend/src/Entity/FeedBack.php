<?php

namespace App\Entity;

use App\Repository\FeedBackRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FeedBackRepository::class)]
class FeedBack
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'feedBacks')]
    private ?User $client = null;

    #[ORM\ManyToOne(inversedBy: 'feedBacks')]
    private ?Company $company = null;

    #[ORM\ManyToOne(inversedBy: 'feedBacks')]
    private ?FeedBackBuilder $feedBackBuilder = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'feedBack', targetEntity: FeedBackGroup::class, orphanRemoval: true)]
    private Collection $feedBackGroups;

    public function __construct()
    {
        $this->feedBackGroups = new ArrayCollection();
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function updatedTimestamps(): void
    {
        $this->setUpdatedAt(new \DateTime('now'));
        if ($this->getCreatedAt() === null) {
            $this->setCreatedAt(new \DateTimeImmutable('now'));
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getClient(): ?User
    {
        return $this->client;
    }

    public function setClient(?User $client): static
    {
        $this->client = $client;

        return $this;
    }

    public function getCompany(): ?Company
    {
        return $this->company;
    }

    public function setCompany(?Company $company): static
    {
        $this->company = $company;

        return $this;
    }

    public function getFeedBackBuilder(): ?FeedBackBuilder
    {
        return $this->feedBackBuilder;
    }

    public function setFeedBackBuilder(?FeedBackBuilder $feedBackBuilder): static
    {
        $this->feedBackBuilder = $feedBackBuilder;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, FeedBackGroup>
     */
    public function getFeedBackGroups(): Collection
    {
        return $this->feedBackGroups;
    }

    public function addFeedBackGroup(FeedBackGroup $feedBackGroup): static
    {
        if (!$this->feedBackGroups->contains($feedBackGroup)) {
            $this->feedBackGroups->add($feedBackGroup);
            $feedBackGroup->setFeedBack($this);
        }

        return $this;
    }

    public function removeFeedBackGroup(FeedBackGroup $feedBackGroup): static
    {
        if ($this->feedBackGroups->removeElement($feedBackGroup)) {
            // set the owning side to null (unless already changed)
            if ($feedBackGroup->getFeedBack() === $this) {
                $feedBackGroup->setFeedBack(null);
            }
        }

        return $this;
    }
}