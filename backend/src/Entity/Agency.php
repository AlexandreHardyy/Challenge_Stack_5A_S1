<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Repository\AgencyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AgencyRepository::class)]
// #[ApiResource(
//     operations: [
//         new GetCollection(),
//         new Get(),
//         new Delete(),
//         new Patch()
//     ]
// )]
#[ApiResource(
    uriTemplate: '/companies/{id}/agencies',
    operations: [
        new GetCollection(
            openapi: new Operation(
                tags: [ 'Agency', 'Company' ],
                summary: 'Returns a list of agencies for a specific company',
                description: 'Returns a list of agencies for a specific company'
            )
        ),
        // new Post()
    ],
    uriVariables: [
        'id' => new Link(toProperty: 'company', fromClass: Company::class)
    ]
)]
#[ApiResource(
    normalizationContext:['groups' => ['agency-group-read']],
    uriTemplate: '/companies/{companyId}/agencies/{agencyId}',
    operations: [
        new Get(
            openapi: new Operation(
                tags: [ 'Agency', 'Company' ],
                summary: 'Returns one of the agencies of a company',
                description: 'Returns a single agency of a company by providing the companyId and the agencyId'
            )
        ),
        // new Patch()
    ],
    uriVariables: [
        'companyId' => new Link(toProperty: 'company', fromClass: Company::class),
        'agencyId' => new Link(fromClass: Agency::class)
    ]
)]
class Agency
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['company-group-read', 'agency-group-read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['company-group-read', 'agency-group-read'])]
    private ?string $address = null;

    #[ORM\Column(length: 255)]
    #[Groups(['company-group-read', 'agency-group-read'])]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Groups(['company-group-read', 'agency-group-read'])]
    private ?string $zip = null;

    #[ORM\Column]
    #[Groups(['agency-group-read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['agency-group-read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'agencies')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['agency-group-read'])]
    private ?Company $company = null;

    #[ORM\Column(length: 255)]
    #[Groups(['company-group-read', 'agency-group-read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['agency-group-read'])]
    private ?string $description = null;

    #[ORM\OneToMany(mappedBy: 'agency', targetEntity: Service::class, orphanRemoval: true)]
    #[Groups(['agency-group-read'])]
    private Collection $services;

    public function __construct()
    {
        $this->services = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getZip(): ?string
    {
        return $this->zip;
    }

    public function setZip(string $zip): static
    {
        $this->zip = $zip;

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

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

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
            $service->setAgency($this);
        }

        return $this;
    }

    public function removeService(Service $service): static
    {
        if ($this->services->removeElement($service)) {
            // set the owning side to null (unless already changed)
            if ($service->getAgency() === $this) {
                $service->setAgency(null);
            }
        }

        return $this;
    }
}
