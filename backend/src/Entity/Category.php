<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\Metadata\Link;
use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ApiResource(
    uriTemplate: '/companies/{id}/categories',
    operations: [
        new GetCollection(
            normalizationContext:['groups' => ['categories-group-read']],
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
#[ApiResource(
    uriTemplate: '/companies/{idCompany}/categories/{idCategory}',
    operations: [
        // new Patch()
    ],
    uriVariables: [
        'idCompany' => new Link(toProperty: 'company', fromClass: Company::class),
        'idCategory' => new Link(fromClass: Category::class)
    ]
)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['company-group-read', 'agency-group-read', 'categories-group-read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['company-group-read', 'agency-group-read', 'categories-group-read'])]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'categories')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Company $company = null;

    #[Groups(['categories-group-read'])]
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
