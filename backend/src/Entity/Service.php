<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Repository\ServiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ServiceRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            openapi: new Operation(
                tags: ['Service'],
                summary: 'Returns a service of an agency',
                description: 'Returns a single service of an agency by providing the agencyId and the serviceId'
            ),
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            openapi: new Operation(
                tags: ['Service'],
                summary: 'new service',
                description: 'Create a new service for a company'
            ),
            denormalizationContext: ['groups' => 'create-service'],
            security: "is_granted('SERVICE_CREATE', object)"
        ),
        new Patch(
            openapi: new Operation(
                tags: ['Service'],
                summary: 'new service',
                description: 'Create a new service for a company'
            ),
            denormalizationContext: ['groups' => 'create-service'],
            security: "is_granted('SERVICE_EDIT', object)"
        ),
        new Delete(
            openapi: new Operation(
                tags: ['Service'],
                summary: 'delete service',
                description: 'Delete a service'
            ),
            security: "is_granted('SERVICE_EDIT', object)"
        )
    ]
)]

class Service
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['agency:read', 'agency:read:collection:by_company', 'category:read:collection:by_company'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['create-service', 'agency:read:collection', 'agency:read', 'agency:read:collection:by_company', 'category:read:collection:by_company', 'session:read:collection:by_instructor', 'session:read:collection:by_student', 'session:read', 'session:read:collection'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['create-service', 'agency:read', 'category:read:collection:by_company'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['create-service', 'agency:read', 'category:read:collection:by_company', 'session:read:collection', 'agency:read:collection:by_company'])]
    private ?float $duration = null;

    #[ORM\Column]
    #[Groups(['create-service', 'agency:read', 'category:read:collection:by_company', 'session:read:collection', 'agency:read:collection:by_company'])]
    private ?float $price = null;

    #[ORM\ManyToOne(inversedBy: 'services')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['create-service', 'agency:read'])]
    private ?Category $category = null;

    #[ORM\ManyToMany(targetEntity: Agency::class, inversedBy: 'services')]
    private Collection $agencies;

    #[ORM\OneToMany(mappedBy: 'service', targetEntity: Session::class, orphanRemoval: true)]
    private Collection $sessions;

    #[ORM\OneToMany(mappedBy: 'service', targetEntity: RatingService::class)]
    private Collection $ratingServices;

    public function __construct()
    {
        $this->agencies = new ArrayCollection();
        $this->sessions = new ArrayCollection();
        $this->ratingServices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDuration(): ?float
    {
        return $this->duration;
    }

    public function setDuration(float $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection<int, Agency>
     */
    public function getAgencies(): Collection
    {
        return $this->agencies;
    }

    public function addAgency(Agency $agency): static
    {
        if (!$this->agencies->contains($agency)) {
            $this->agencies->add($agency);
        }

        return $this;
    }

    public function removeAgency(Agency $agency): static
    {
        $this->agencies->removeElement($agency);

        return $this;
    }

    /**
     * @return Collection<int, Session>
     */
    public function getSessions(): Collection
    {
        return $this->sessions;
    }

    public function addSession(Session $session): static
    {
        if (!$this->sessions->contains($session)) {
            $this->sessions->add($session);
            $session->setService($this);
        }

        return $this;
    }

    public function removeSession(Session $session): static
    {
        if ($this->sessions->removeElement($session)) {
            // set the owning side to null (unless already changed)
            if ($session->getService() === $this) {
                $session->setService(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, RatingService>
     */
    public function getRatingServices(): Collection
    {
        return $this->ratingServices;
    }

    public function addRatingService(RatingService $ratingService): static
    {
        if (!$this->ratingServices->contains($ratingService)) {
            $this->ratingServices->add($ratingService);
            $ratingService->setService($this);
        }

        return $this;
    }

    public function removeRatingService(RatingService $ratingService): static
    {
        if ($this->ratingServices->removeElement($ratingService)) {
            // set the owning side to null (unless already changed)
            if ($ratingService->getService() === $this) {
                $ratingService->setService(null);
            }
        }

        return $this;
    }
}
