<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\OpenApi\Model\Operation;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ApiResource(
    operations: [
        new GetCollection(normalizationContext: ['groups' => ['read-user'], 'enable_max_depth' => true]),
        new Get(normalizationContext: ['groups' => ['read-user', 'employee:read'], 'enable_max_depth' => true],
                security: "is_granted('USER_VIEW', object)"),
        new Post(denormalizationContext: ['groups' => ['create-user']]),
        new Patch(denormalizationContext: ['groups' => ['update-user']])
    ],
    normalizationContext: ['groups' => ['read-user']],
)]

#[ApiResource(
    uriTemplate: '/companies/{id}/users',
    operations: [
        new GetCollection(
            uriVariables: [
                'id' => new Link(toProperty: 'company', fromClass: Company::class)
            ],
            normalizationContext:['groups' => ['read-user'], 'enable_max_depth' => true],
            openapi: new Operation(
                tags: [ 'Company', 'User' ],
                summary: 'Returns a list of users for a specific company',
                description: 'Returns a list of users for a specific company'
            )
        )
    ],
)]

#[ApiResource(
    uriTemplate: '/employees',
    operations: [
        new Post(
            security: "is_granted('USER_CREATE', object)",
            denormalizationContext: [ 'groups' => [ 'create-employee' ] ],
            openapi: new Operation(
                tags: [ 'User' ],
                summary: 'create a new employee',
                description: 'Create a new user for a company'
            )
        ),
        new Patch(
            security: "is_granted('USER_EDIT', object)",
            uriTemplate: '/employees/{id}',
            denormalizationContext: [ 'groups' => [ 'create-employee', 'update-employee' ] ],
            openapi: new Operation(
                tags: [ 'User' ],
                summary: 'update a employee',
                description: 'Update a user for a company'
            )
        )
    ],
    normalizationContext: ['groups' => ['read-user']],
)]

#[ApiResource(
    uriTemplate: '/providers',
    operations: [
        new Post(
            denormalizationContext: [ 'groups' => [ 'create-provider' ] ],
            openapi: new Operation(
                tags: [ 'Company', 'User' ],
                summary: 'create a new provider',
                description: 'Create a new user related to a company'
            )
        ),
        new Patch(
            uriTemplate: '/providers/{id}',
            denormalizationContext: [ 'groups' => [ 'create-provider', 'update-provider' ] ],
            openapi: new Operation(
                tags: [ 'Company', 'User' ],
                summary: 'update a provider',
                description: 'Update a user related to a company'
            )
        )
    ],
    normalizationContext: ['groups' => ['read-user']],
)]

#[ApiResource(
    uriTemplate: '/user/me',
    operations: [
        new Get(
            normalizationContext: [
                'groups' => ['read-user'],
                'enable_max_depth' => true,
            ],
            security: "is_granted('USER_VIEW', object)"
        ),
    ]
)]

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(['email'])]
#[ORM\HasLifecycleCallbacks]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read-user', 'agency-group-read', 'session-group-read', 'session-group-read-collection'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['create-user', 'read-user', 'update-user', 'create-employee', 'create-provider'])]
    #[Assert\NotBlank(groups: ['create-user'])]
    #[Assert\Email()]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['read-user', 'update-user'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Groups([ 'create-user' ])]
    #[Assert\NotBlank(groups: ['create-user'])]
    #[Assert\Regex(pattern: '/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/')]
    private string $plainPassword = '';

    #[ORM\Column(length: 255)]
    #[Groups(['create-user', 'read-user', 'update-user', 'create-employee', 'create-provider', 'agency-group-read'])]
    #[Assert\NotBlank(groups: ['create-user'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['create-user', 'read-user', 'update-user', 'create-employee', 'create-provider', 'agency-group-read'])]
    #[Assert\NotBlank(groups: ['create-user'])]
    private ?string $lastname = null;

    #[ORM\Column]
    #[Groups(['read-user', 'update-user'])]
    private ?bool $isVerified = false;

    #[ORM\Column]
    #[Groups(['read-user'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['read-user', 'update-user'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[Groups(['employee:read', 'create-employee', 'create-provider', 'update-provider'])]
    private ?Company $company = null;

    #[ORM\ManyToMany(targetEntity: Agency::class, inversedBy: 'users', cascade: ["persist"])]
    #[Groups(['employee:read', 'update-employee'])]
    private Collection $agencies;

    #[ORM\OneToMany(mappedBy: 'student', targetEntity: Session::class, orphanRemoval: true)]
    #[MaxDepth(1)]
    #[Groups(['student:read'])]
    private Collection $studentSessions;

    #[ORM\OneToMany(mappedBy: 'instructor', targetEntity: Session::class, orphanRemoval: true)]
    // TODO: Find a better way than MaxDepth
    #[MaxDepth(1)]
    #[Groups(['employee:read'])]
    private Collection $instructorSessions;

    #[ORM\OneToMany(mappedBy: 'employee', targetEntity: Schedule::class, orphanRemoval: true)]
    #[MaxDepth(1)]
    #[Groups(['employee:read'])]
    private Collection $schedules;

    #[ORM\Column(length: 30)]
    #[Groups(['create-user', 'read-user', 'update-user', 'create-employee', 'create-provider', 'agency-group-read'])]
    private ?string $phoneNumber = null;

    #[Groups('employee:read')]
    public function getStudentMarks(): float
    {
        $totalMark = 0;
        $numberOfSessions = 0;

        $studentSessions = $this->getStudentSessions();

        foreach ($studentSessions as $session) {
            if ($session->getStudentMark() !== null) {
                $totalMark += $session->getStudentMark();
                $numberOfSessions++;
            }
        }

        if ($numberOfSessions === 0) {
            return null;
        }

        return $totalMark / $numberOfSessions;
    }

    public function __construct()
    {
        $this->agencies = new ArrayCollection();
        $this->studentSessions = new ArrayCollection();
        $this->instructorSessions = new ArrayCollection();
        $this->schedules = new ArrayCollection();
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function isIsVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getPlainPassword(): string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(string $plainPassword): void
    {
        $this->plainPassword = $plainPassword;
        $this->password = $plainPassword;
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
    public function getStudentSessions(): Collection
    {
        return $this->studentSessions;
    }

    public function addStudentSessions(Session $session): static
    {
        if (!$this->studentSessions->contains($session)) {
            $this->studentSessions->add($session);
            $session->setStudent($this);
        }

        return $this;
    }

    public function removeStudentSessions(Session $session): static
    {
        if ($this->studentSessions->removeElement($session)) {
            // set the owning side to null (unless already changed)
            if ($session->getStudent() === $this) {
                $session->setStudent(null);
            }
        }

        return $this;
    }

     /**
     * @return Collection<int, Session>
     */
    public function getInstructorSessions(): Collection
    {
        return $this->instructorSessions;
    }

    public function addInstructorSessions(Session $session): static
    {
        if (!$this->instructorSessions->contains($session)) {
            $this->instructorSessions->add($session);
            $session->setStudent($this);
        }

        return $this;
    }

    public function removeInstructorSessions(Session $session): static
    {
        if ($this->instructorSessions->removeElement($session)) {
            // set the owning side to null (unless already changed)
            if ($session->getStudent() === $this) {
                $session->setStudent(null);
            }
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
            $schedule->setEmployee($this);
        }

        return $this;
    }

    public function removeSchedule(Schedule $schedule): static
    {
        if ($this->schedules->removeElement($schedule)) {
            // set the owning side to null (unless already changed)
            if ($schedule->getEmployee() === $this) {
                $schedule->setEmployee(null);
            }
        }

        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): static
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }
}
