<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Repository\FeedBackBuilderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FeedBackBuilderRepository::class)]
#[ApiResource(
    uriTemplate: '/companies/{id}/feed_back_builders',
    operations: [
        new GetCollection(
            uriVariables: [
                'id' => new Link(toProperty: 'company', fromClass: Company::class)
            ],
            openapi: new Operation(
                tags: ['FeedBackBuilder'],
                summary: 'get feedback builders from a company',
                description: 'Returns a list of feedback builders for a specific company'
            )
        )
    ],
)]
#[ApiResource(
    operations: [
        new Post(
            openapi: new Operation(
                tags: ['FeedBackBuilder'],
                summary: 'Create feedback builder for a company',
                description: 'Create a new feedback builder for a company'
            )
        ),
        new Patch(
            openapi: new Operation(
                tags: ['FeedBackBuilder'],
                summary: 'Update feedback builder',
                description: 'Update a feedback builder by id'
            )
        ),
        new Delete(
            openapi: new Operation(
                tags: ['FeedBackBuilder'],
                summary: 'Delete feedback builder',
                description: 'Delete a feedback builder by id'
            )
        )
    ],
)]
class FeedBackBuilder
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\ManyToOne(inversedBy: 'feedBackBuilders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Company $company = null;

    #[ORM\Column]
    private array $questions = [];

    #[ORM\Column(nullable: true)]
    private ?bool $isSelected = null;

    #[ORM\OneToMany(mappedBy: 'feedBackBuilder', targetEntity: FeedBack::class)]
    private Collection $feedBacks;

    public function __construct()
    {
        $this->feedBacks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

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

    public function getQuestions(): array
    {
        return $this->questions;
    }

    public function setQuestions(array $questions): static
    {
        $this->questions = $questions;

        return $this;
    }

    public function isIsSelected(): ?bool
    {
        return $this->isSelected;
    }

    public function setIsSelected(?bool $isSelected): static
    {
        $this->isSelected = $isSelected;

        return $this;
    }

    /**
     * @return Collection<int, FeedBack>
     */
    public function getFeedBacks(): Collection
    {
        return $this->feedBacks;
    }

    public function addFeedBack(FeedBack $feedBack): static
    {
        if (!$this->feedBacks->contains($feedBack)) {
            $this->feedBacks->add($feedBack);
            $feedBack->setFeedBackBuilder($this);
        }

        return $this;
    }

    public function removeFeedBack(FeedBack $feedBack): static
    {
        if ($this->feedBacks->removeElement($feedBack)) {
            // set the owning side to null (unless already changed)
            if ($feedBack->getFeedBackBuilder() === $this) {
                $feedBack->setFeedBackBuilder(null);
            }
        }

        return $this;
    }
}
