<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Repository\AgencyRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AgencyRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            // normalizationContext:['groups' => ['agency:read'], 'enable_max_depth' => true],
            openapi: new Operation(
                tags: [ 'Agency' ],
                summary: 'Returns agency by Id',
                description: 'Returns a single agency provided by the id'
            ),
            normalizationContext: ['groups' => ['agency:read']]
        ),
        new GetCollection(
            // normalizationContext:['groups' => ['agency:read:collection'], 'enable_max_depth' => true],
            openapi: new Operation(
                tags: [ 'Agency' ],
                summary: 'Returns agencies',
                description: 'Returns several agencies'
            ),
            normalizationContext: ['groups' => ['agency:read:collection']]
        ),
        new Patch(
            openapi: new Operation(
                tags: [ 'Agency' ],
                summary: 'Update agency by Id',
                description: 'Update agency provided by the id'
            ),
            security: "is_granted('AGENCY_EDIT', object)"
        ),
        new Post(
            openapi: new Operation(
                tags: [ 'Agency' ],
                summary: 'new agency',
                description: 'Create a new agency for a company'
            ),
            denormalizationContext: ['groups' => 'create-agency'],
            security: "is_granted('AGENCY_CREATE', object)"
        ),
        new Delete(
            openapi: new Operation(
                tags: [ 'Agency' ],
                summary: 'delete agency',
                description: 'delete an agency'
            ),
            security: "is_granted('AGENCY_EDIT', object)"
        )
    ],
    security: "is_granted('ROLE_USER')",
    // normalizationContext: ['groups' => ['read-media_object'], 'enable_max_depth' => true]
)]
#[ApiResource(
    uriTemplate: '/companies/{id}/agencies',
    operations: [
        new GetCollection(
            // normalizationContext:['groups' => ['agency:read:collection:by-companies'], 'enable_max_depth' => true],
            openapi: new Operation(
                tags: [ 'Agency', 'Company' ],
                summary: 'Returns a list of agencies for a specific company',
                description: 'Returns a list of agencies for a specific company'
            ),
            normalizationContext: ['groups' => ['agency:read:collection:by_company']]
        ),
    ],
    uriVariables: [
        'id' => new Link(toProperty: 'company', fromClass: Company::class)
    ],
    security: "is_granted('ROLE_USER')"
)]


#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial', 'services.name' => 'partial', 'address' => 'partial', 'city' => 'partial', 'zip' => 'partial',])]
class Agency
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['company:read:collection', 'session:read:collection', 'agency:read:collection', 'company:read', 'agency:read', 'user:read:collection:by_company', 'agency:read:collection:by_company', 'session:read', 'user:read' ])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['create-agency', 'agency:read:collection', 'company:read', 'agency:read', 'agency:read:collection:by_company'])]
    private ?string $address = null;

    #[ORM\Column(length: 255)]
    #[Groups(['create-agency', 'agency:read:collection', 'company:read', 'agency:read', 'agency:read:collection:by_company'])]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Groups(['create-agency', 'agency:read:collection', 'company:read', 'agency:read', 'agency:read:collection:by_company'])]
    private ?string $zip = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'agencies')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['create-agency', 'agency:read:collection', 'session:read'])]
    private ?Company $company = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read:collection:by_company', 'create-agency', 'agency:read:collection', 'company:read:collection', 'session:read:collection', 'company:read', 'agency:read', 'agency:read:collection:by_company', 'session:read', 'user:read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['agency:read:collection', 'agency:read', 'agency:read:collection:by_company'])]
    private ?string $description = null;

    #[ORM\ManyToMany(targetEntity: Service::class, mappedBy: 'agencies')]
    // #[Groups(['create-agency'])]
    #[Groups(['agency:read:collection', 'agency:read', 'agency:read:collection:by_company'])]
    private Collection $services;

    #[ORM\Column(type: Types::SIMPLE_ARRAY)]
    #[Groups(['create-agency', 'agency:read:collection', 'company:read', 'agency:read'])]
    private array $geoloc = [];

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'agencies')]
    #[Groups(['agency:read'])]
    private Collection $users;

    #[ORM\OneToMany(mappedBy: 'agency', targetEntity: Schedule::class, orphanRemoval: true)]
    private Collection $schedules;
    
    #[ORM\OneToMany(mappedBy: 'agency', targetEntity: Session::class, orphanRemoval: true)]
    #[Groups(['agency:read'])]
    private Collection $sessions;

    #[ORM\OneToMany(mappedBy: 'agency', targetEntity: MediaObject::class)]
    private Collection $image;

    public function __construct()
    {
        $this->services = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->schedules = new ArrayCollection();
        $this->sessions = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new DateTimeImmutable();
        $this->updatedAt = new DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new DateTimeImmutable();
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

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(DateTimeImmutable $updatedAt): static
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
            $service->addAgency($this);
        }

        return $this;
    }

    public function removeService(Service $service): static
    {
        if ($this->services->removeElement($service)) {
            $service->removeAgency($this);
        }

        return $this;
    }

    public function getGeoloc(): array
    {
        return $this->geoloc;
    }

    public function setGeoloc(array $geoloc): static
    {
        $this->geoloc = $geoloc;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->addAgency($this);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            $user->removeAgency($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Schedule>
     */
    public function getSchedules(): Collection
    {
        return $this->schedules;
    }

    public function addSchedule(Schedule $schedule): static
    {
        if (!$this->schedules->contains($schedule)) {
            $this->schedules->add($schedule);
            $schedule->setAgency($this);
        }

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
            $session->setAgency($this);
        }

        return $this;
    }

    public function removeSchedule(Schedule $schedule): static
    {
        if ($this->schedules->removeElement($schedule)) {
            // set the owning side to null (unless already changed)
            if ($schedule->getAgency() === $this) {
                $schedule->setAgency(null);
            }
        }

        return $this;
    }

    public function removeSession(Session $session): static
    {
        if ($this->sessions->removeElement($session)) {
            // set the owning side to null (unless already changed)
            if ($session->getAgency() === $this) {
                $session->setAgency(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, MediaObject>
     */
    public function getImage(): Collection
    {
        return $this->image;
    }

    public function addImage(MediaObject $image): static
    {
        if (!$this->image->contains($image)) {
            $this->image->add($image);
            $image->setAgency($this);
        }

        return $this;
    }

    public function removeImage(MediaObject $image): static
    {
        if ($this->image->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getAgency() === $this) {
                $image->setAgency(null);
            }
        }

        return $this;
    }
}
