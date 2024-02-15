<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
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

  // public function getScheduleExceptions(): Collection 
  // {
  //   return $this->scheduleExceptions;
  // }
}