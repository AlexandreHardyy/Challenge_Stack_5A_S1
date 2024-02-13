<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Repository\ScheduleExceptionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ScheduleExceptionRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            openapi: new Operation(
                tags: ['Schedule'],
                summary: 'get exception schedules',
                description: 'get schedule exeption'
            )
        ),
        new Post(
            security: "is_granted('ROLE_EMPLOYEE')",
            openapi: new Operation(
                tags: ['Schedule'],
                summary: 'Add exception schedules',
                description: 'Add schedule exeption for shedule day'
            )
        ),
        new Patch(
            security: "is_granted('ROLE_PROVIDER')",
            denormalizationContext: ['groups' => ['schedule-exception-validation']],
            openapi: new Operation(
                tags: ['Schedule'],
                summary: 'Edit status exception',
                description: 'You can validate or refuse exception schedule'
            )
        ),
    ]
)]
class ScheduleException
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['disponibility:read:collection'])]
    private ?int $startHour = null;

    #[ORM\Column]
    #[Groups(['disponibility:read:collection'])]
    private ?int $endHour = null;

    #[ORM\ManyToOne(inversedBy: 'scheduleExceptions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Schedule $schedule = null;

    #[ORM\Column(length: 255)]
    #[Groups(['schedule-exception-validation'])]
    private ?string $status = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStartHour(): ?int
    {
        return $this->startHour;
    }

    public function setStartHour(int $startHour): static
    {
        $this->startHour = $startHour;

        return $this;
    }

    public function getEndHour(): ?int
    {
        return $this->endHour;
    }

    public function setEndHour(int $endHour): static
    {
        $this->endHour = $endHour;

        return $this;
    }

    public function getSchedule(): ?Schedule
    {
        return $this->schedule;
    }

    public function setSchedule(?Schedule $schedule): static
    {
        $this->schedule = $schedule;

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
}
