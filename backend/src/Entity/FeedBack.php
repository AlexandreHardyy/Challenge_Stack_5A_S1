<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Repository\FeedBackRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FeedBackRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Post(
            security: "is_granted('ROLE_USER')",
            denormalizationContext: ['groups' => ['create-feedback']],
            openapi: new Operation(
                tags: ['FeedBack'],
                summary: 'Create feedback for a session',
                description: 'Create a new feedback for a session'
            )
        )
    ],
)]
#[ApiResource(
    uriTemplate: '/feed_back_builders/{id}/feed_backs',
    security: "is_granted('ROLE_PROVIDER') or is_granted('ROLE_ADMIN')",
    operations: [
        new GetCollection(
            openapi: new Operation(
                tags: [ 'FeedBack' ],
                summary: 'Returns a list of feedbacks for a specific feedback builder',
                description: 'Returns a list of feedbacks for a specific feedback builder',
            ),
            normalizationContext: [ 'groups' => 'feed_backs:read:collection:by_feed_back_builder']
        ),
    ],
    uriVariables: [
        'id' => new Link(toProperty: 'feedBackBuilder', fromClass: FeedBackBuilder::class)
    ]
)]
class FeedBack
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'feedBacks')]
    #[Groups(['create-feedback', 'feed_backs:read:collection:by_feed_back_builder'])]
    private ?User $client = null;

    #[ORM\ManyToOne(inversedBy: 'feedBacks')]
    #[Groups(['create-feedback'])]
    private ?Company $company = null;

    #[ORM\ManyToOne(inversedBy: 'feedBacks')]
    #[Groups(['create-feedback'])]
    private ?FeedBackBuilder $feedBackBuilder = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['feed_backs:read:collection:by_feed_back_builder'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['feed_backs:read:collection:by_feed_back_builder'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'feedBack', targetEntity: FeedBackGroup::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    #[Groups(['create-feedback', 'feed_backs:read:collection:by_feed_back_builder'])]
    private Collection $feedBackGroups;

    #[ORM\OneToOne(inversedBy: 'feedBack', cascade: ['persist', 'remove'])]
    #[Groups(['create-feedback'])]
    private ?Session $session = null;

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

    public function getSession(): ?Session
    {
        return $this->session;
    }

    public function setSession(?Session $session): static
    {
        $this->session = $session;

        return $this;
    }
}
