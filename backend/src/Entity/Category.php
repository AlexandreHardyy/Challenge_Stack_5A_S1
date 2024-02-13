<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ApiResource(
    operations: [
        new Post(
            security: "is_granted('CATEGORY_CREATE', object)",
            denormalizationContext: ['groups' => 'create-category'],
            openapi: new Operation(
                tags: ['Category'],
                summary: 'new category',
                description: 'Create a new category for a company'
            )
        ),
        new Patch(
            security: "is_granted('CATEGORY_EDIT', object)",
            denormalizationContext: ['groups' => 'update-category'],
            openapi: new Operation(
                tags: ['Category'],
                summary: 'Update category',
                description: 'Update a category'
            )          
        ),
        new Delete(
            security: "is_granted('CATEGORY_EDIT', object)",
            openapi: new Operation(
                tags: ['Category'],
                summary: 'Delete category',
                description: 'Delete a category'
            )
        )
    ]
)]
#[ApiResource(
    uriTemplate: '/companies/{id}/categories',
    security: "is_granted('ROLE_USER')",
    operations: [
        new GetCollection(
            normalizationContext:['groups' => ['category:read:collection:by-companies']],
            openapi: new Operation(
                tags: [ 'Category' ],
                summary: 'Returns a service of an agency',
                description: 'Returns categories of a company'
            )
        ),
    ],
    uriVariables: [
        'id' => new Link(toProperty: 'company', fromClass: Company::class)
    ]
)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['create-category', 'update-category', 'agency:read'])]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'categories')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['create-category'])]
    private ?Company $company = null;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: Service::class, orphanRemoval: true)]
    private Collection $services;

    public function __construct()
    {
        $this->services = new ArrayCollection();
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

    public function getCompany(): ?Company
    {
        return $this->company;
    }

    public function setCompany(?Company $company): static
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection<int, Service>
     */
    public function getServices(): Collection
    {
        return $this->services;
    }

    public function addService(Service $service): static
    {
        if (!$this->services->contains($service)) {
            $this->services->add($service);
            $service->setCategory($this);
        }

        return $this;
    }

    public function removeService(Service $service): static
    {
        if ($this->services->removeElement($service)) {
            // set the owning side to null (unless already changed)
            if ($service->getCategory() === $this) {
                $service->setCategory(null);
            }
        }

        return $this;
    }
}
