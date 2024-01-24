<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Controller\AddSquedule;
use App\Repository\ScheduleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ScheduleRepository::class)]
#[ApiResource(
    operations: [
        new Post(
            name: 'schedules', 
            uriTemplate: '/schedules', 
            controller: AddSquedule::class,
            input: ScheduleInput::class,
            openapi: new Operation(
                tags: [ 'Schedule' ],
                summary: 'Add multiple schedules',
                description: 'Add schedule for every day in a dateRange'
            )
        )
    ]
)]
class Schedule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['agency-group-read', 'employee:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['agency-group-read', 'employee:read'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column]
    #[Groups(['agency-group-read', 'employee:read'])]
    private ?int $startHour = null;

    #[ORM\Column]
    #[Groups(['agency-group-read', 'employee:read'])]
    private ?int $endHour = null;

    #[ORM\ManyToOne(inversedBy: 'schedules')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Agency $agency = null;

    #[ORM\ManyToOne(inversedBy: 'schedules')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['agency-group-read'])]
    private ?User $employee = null;

    #[ORM\OneToMany(mappedBy: 'schedule', targetEntity: ScheduleException::class)]
    private Collection $scheduleExceptions;

    public function __construct()
    {
        $this->scheduleExceptions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
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

    public function getAgency(): ?Agency
    {
        return $this->agency;
    }

    public function setAgency(?Agency $agency): static
    {
        $this->agency = $agency;

        return $this;
    }

    public function getEmployee(): ?User
    {
        return $this->employee;
    }

    public function setEmployee(?User $employee): static
    {
        $this->employee = $employee;

        return $this;
    }

    /**
     * @return Collection<int, ScheduleException>
     */
    public function getScheduleExceptions(): Collection
    {
        return $this->scheduleExceptions;
    }

    public function addScheduleException(ScheduleException $scheduleException): static
    {
        if (!$this->scheduleExceptions->contains($scheduleException)) {
            $this->scheduleExceptions->add($scheduleException);
            $scheduleException->setSchedule($this);
        }

        return $this;
    }

    public function removeScheduleException(ScheduleException $scheduleException): static
    {
        if ($this->scheduleExceptions->removeElement($scheduleException)) {
            // set the owning side to null (unless already changed)
            if ($scheduleException->getSchedule() === $this) {
                $scheduleException->setSchedule(null);
            }
        }

        return $this;
    }
}

class ScheduleInput
{
    #[ApiProperty(
        description: "Start hour"
    )]
    public int $startHour;

    #[ApiProperty(
        description: "End hour"
    )]
    public int $endHour;

    #[ApiProperty(
        description: "Date range in the format { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }"
    )]
    public DateRange $date;

    #[ApiProperty(
        description: "Agency ID"
    )]
    public int $agencyId;

    #[ApiProperty(
        description: "Employee ID"
    )]
    public int $employeeId;
}

class DateRange
{
    public string $from;
    public string $to;
}