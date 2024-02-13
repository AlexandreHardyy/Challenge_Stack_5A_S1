<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\DataProvider\DisponibilityProvider;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(
          uriTemplate: '/agencies/{id}/disponibilities',
          provider: DisponibilityProvider::class,
          normalizationContext: ['groups' => ['disponibility:read:collection']],
        )
    ]
)]

class Disponibility
{
  public function __construct(
    #[Groups(['disponibility:read:collection'])]
    protected string $userId,
    #[Groups(['disponibility:read:collection'])]
    protected Collection $sessions,
    #[Groups(['disponibility:read:collection'])]
    protected Collection $schedules,
    #[Groups(['disponibility:read:collection'])]
    protected Collection $scheduleExceptions
  )
  {
  }

  public function getUserId(): string 
  {
    return $this->userId;
  }

  public function getSessions(): Collection 
  {
    return $this->sessions;
  }

  public function getSchedules(): Collection 
  {
    return $this->schedules;
  }

  public function getScheduleExceptions(): Collection 
  {
    return $this->scheduleExceptions;
  }
}