<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Repository\CompanyRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CompanyRepository::class)]
#[ApiResource(
    // normalizationContext: ['groups' => ['company-group-read', 'read-media_object'], 'enable_max_depth' => true],
    operations: [
        new GetCollection(
            openapi: new Operation(
                tags: ['Company'],
                summary: 'Return companies',
                description: 'Return all companies'
            ),
            normalizationContext: ['groups' => ['company:read:collection']],
            security: "is_granted('ROLE_USER')"
        ),
        new Get(
            openapi: new Operation(
                tags: ['Company'],
                summary: 'Return one company',
                description: 'Return one company by Id'
            ),
            normalizationContext: ['groups' => ['company:read']],
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            openapi: new Operation(
                tags: ['Company'],
                summary: 'Create company',
                description: 'Create a new company'
            )
        ),
        new Delete(
            openapi: new Operation(
                tags: ['Company'],
                summary: 'Delete company',
                description: 'Delete a company by id'
            ),
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Patch(
            openapi: new Operation(
                tags: ['Company'],
                summary: 'Update company',
                description: 'Update a company by id'
            ),
            denormalizationContext: ['groups' => ['update-company']],
            security: "is_granted('COMPANY_EDIT', object)"
        )
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['socialReason' => 'partial', 'categories.name' => 'partial'])]
class Company
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read:me', 'company:read', 'company:read:collection', 'agency:read:collection', 'session:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['update-company', 'company:read:collection', 'company:read', 'user:read:collection:by_agencies', 'user:read:collection'])]
    private ?string $socialReason = null;

    #[ORM\Column(length: 255)]
    #[Groups(['update-company', 'company:read', 'company:read:collection'])]
    private ?string $email = null;

    #[ORM\Column(length: 50)]
    #[Groups(['update-company', 'company:read', 'company:read:collection'])]
    private ?string $phoneNumber = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['update-company', 'company:read:collection', 'company:read'])]
    private ?string $siren = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['update-company', 'company:read', 'company:read:collection', 'company:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['update-company', 'company:read:collection', 'company:read', 'company:read', 'update-company'])]
    private ?bool $isVerified = false;

    #[ORM\Column]
    #[Groups(['company:read:collection', 'company:read'])]
    private ?DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['company:read:collection'])]
    private ?DateTimeImmutable $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'company', targetEntity: Agency::class, orphanRemoval: true)]
    #[Groups(['company:read', 'company:read:collection'])]
    private Collection $agencies;

    #[ORM\OneToMany(mappedBy: 'company', targetEntity: Category::class, orphanRemoval: true)]
    private Collection $categories;

    #[ORM\OneToMany(mappedBy: 'company', targetEntity: User::class)]
    private Collection $users;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['update-company'])]
    private ?MediaObject $image = null;

    #[ORM\OneToMany(mappedBy: 'company', targetEntity: FeedBackBuilder::class)]
    private Collection $feedBackBuilders;

    #[ORM\OneToMany(mappedBy: 'company', targetEntity: FeedBack::class)]
    private Collection $feedBacks;

    public function __construct()
    {
        $this->agencies = new ArrayCollection();
        $this->categories = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->feedBackBuilders = new ArrayCollection();
        $this->feedBacks = new ArrayCollection();
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

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): static
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    public function getSiren(): ?string
    {
        return $this->siren;
    }

    public function setSiren(string $siren): static
    {
        $this->siren = $siren;

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

    public function isIsVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

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
            $agency->setCompany($this);
        }

        return $this;
    }

    public function removeAgency(Agency $agency): static
    {
        if ($this->agencies->removeElement($agency)) {
            // set the owning side to null (unless already changed)
            if ($agency->getCompany() === $this) {
                $agency->setCompany(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): static
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
            $category->setCompany($this);
        }

        return $this;
    }

    public function removeCategory(Category $category): static
    {
        if ($this->categories->removeElement($category)) {
            // set the owning side to null (unless already changed)
            if ($category->getCompany() === $this) {
                $category->setCompany(null);
            }
        }

        return $this;
    }

    public function getSocialReason(): ?string
    {
        return $this->socialReason;
    }

    public function setSocialReason(string $socialReason): static
    {
        $this->socialReason = $socialReason;

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
            $user->setCompany($this);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getCompany() === $this) {
                $user->setCompany(null);
            }
        }

        return $this;
    }

    public function getImage(): ?MediaObject
    {
        return $this->image;
    }

    public function setImage(?MediaObject $image): static
    {
        $this->image = $image;

        return $this;
    }
    /**
     * @return Collection<int, FeedBackBuilder>
     */
    public function getFeedBackBuilders(): Collection
    {
        return $this->feedBackBuilders;
    }

    public function addFeedBackBuilder(FeedBackBuilder $feedBackBuilder): static
    {
        if (!$this->feedBackBuilders->contains($feedBackBuilder)) {
            $this->feedBackBuilders->add($feedBackBuilder);
            $feedBackBuilder->setCompany($this);
        }

        return $this;
    }

    public function removeFeedBackBuilder(FeedBackBuilder $feedBackBuilder): static
    {
        if ($this->feedBackBuilders->removeElement($feedBackBuilder)) {
            // set the owning side to null (unless already changed)
            if ($feedBackBuilder->getCompany() === $this) {
                $feedBackBuilder->setCompany(null);
            }
        }

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
            $feedBack->setCompany($this);
        }

        return $this;
    }

    public function removeFeedBack(FeedBack $feedBack): static
    {
        if ($this->feedBacks->removeElement($feedBack)) {
            // set the owning side to null (unless already changed)
            if ($feedBack->getCompany() === $this) {
                $feedBack->setCompany(null);
            }
        }

        return $this;
    }
}
