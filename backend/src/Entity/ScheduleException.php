<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ScheduleExceptionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ScheduleExceptionRepository::class)]
#[ApiResource]
class ScheduleException
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $startHour = null;

    #[ORM\Column]
    private ?int $endHour = null;

    #[ORM\ManyToOne(inversedBy: 'scheduleExceptions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Schedule $schedule = null;

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
}
