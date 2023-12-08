<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\Metadata\Link;
use App\Repository\SessionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: SessionRepository::class)]
#[ApiResource(
    operations: [
        new Post(validationContext: ['groups' => ['session-create']]),
        new GetCollection(
            normalizationContext: ['groups' => ['session-group-read']]
        )
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['service' => 'exact', 'agency' => 'exact', 'status' => 'exact'])]
class Session
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['session-group-read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'studentSessions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $student = null;

    #[ORM\ManyToOne(inversedBy: 'instructorSessions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['session-group-read'])]
    private ?User $instructor = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['session-group-read'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['session-group-read'])]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\ManyToOne(inversedBy: 'sessions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Service $service = null;

    #[ORM\ManyToOne(inversedBy: 'sessions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Agency $agency = null;

    #[ORM\Column(length: 30)]
    #[Groups(['session-group-read'])]
    private ?string $status = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStudent(): ?User
    {
        return $this->student;
    }

    public function setStudent(?User $student): static
    {
        $this->student = $student;

        return $this;
    }

    public function getInstructor(): ?User
    {
        return $this->instructor;
    }

    public function setInstructor(?User $instructor): static
    {
        $this->instructor = $instructor;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getService(): ?Service
    {
        return $this->service;
    }

    public function setService(?Service $service): static
    {
        $this->service = $service;

        return $this;
    }

    public function getAgency(): ?Agency
    {
        return $this->agency;
    }

    public function setAgency(?Agency $agency): static
    {
        $this->agency = $agency;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    #[Assert\Callback(groups: ['session-create'])]
    public function validate(ExecutionContextInterface $context, mixed $payload): void
    {
        $toCreate = $this;
        if ($this->getInstructor()->getInstructorSessions()->filter(function(Session $session) use($toCreate){
            if ($session->getEndDate() < $toCreate->getStartDate()) return false;
            if ($session->getStartDate() > $toCreate->getEndDate()) return false;

            return true;
        })->count()) {
            $context->buildViolation('Instructor is busy')
                ->atPath('instructor')
                ->addViolation();
        }
    }
}
