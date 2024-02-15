<?php

namespace App\DataProvider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Disponibility;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;

final class DisponibilityProvider implements ProviderInterface
{
    public function __construct(protected EntityManagerInterface $entityManager)
    {

    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $startDate = isset($context["filters"]["startDate"]) ? new DateTimeImmutable($context["filters"]["startDate"]) : null;
        $endDate = isset($context["filters"]["endDate"]) ? new DateTimeImmutable($context["filters"]["endDate"]) : null;

        $query = $this->entityManager->createQuery(
            'SELECT i.id
            FROM App\Entity\User i
            JOIN i.agencies a
            WHERE a = :agency'
        )->setParameter('agency', $uriVariables["id"]);

        $instructorIds = $query->getSingleColumnResult();
        
        $query2 = $this->entityManager->createQuery(
            'SELECT s
            FROM App\Entity\Session s
            WHERE s.instructor in (:instructorIds)
            AND s.agency = :agency
            AND s.status != :cancelled'
        )->setParameter('agency', $uriVariables["id"])->setParameter('instructorIds', $instructorIds)->setParameter('cancelled', 'cancelled');

        $sessions = $query2->getResult();
        
        $query3 = $this->entityManager->createQuery(
            'SELECT sc
            FROM App\Entity\Schedule sc
            WHERE sc.employee in (:instructorIds)
            AND sc.agency = :agency'
        )->setParameter('agency', $uriVariables["id"])->setParameter('instructorIds', $instructorIds);

        $schedules = $query3->getResult();
        
        $results = [];
        foreach($instructorIds as $instructorId) {
            $results[$instructorId] = [
                'sessions' => [],
                'schedules' => [],
                'scheduleExceptions' => [],
            ];
        }
        
        foreach($sessions as $session) {
            if ($startDate && $endDate) {
                if ($session->getStartDate() >= $startDate && $session->getEndDate() <= $endDate) {
                    $results[$session->getInstructor()->getId()]['sessions'][] = $session;
                }
            } else {
                $results[$session->getInstructor()->getId()]['sessions'][] = $session;
            }

        }

        foreach($schedules as $schedule) {
            if ($startDate && $endDate) {
                if ($schedule->getDate() >= $startDate && $schedule->getDate() <= $endDate) {
                    $scheduleExceptions = $schedule->getScheduleExceptions()->toArray();
                    $schedule->setScheduleExceptions(new ArrayCollection(array_filter($scheduleExceptions, function($exception) {
                        return $exception->getStatus() === 'VALIDATED';
                    })));
                    $results[$schedule->getEmployee()->getId()]['schedules'][] = $schedule;
                }
            } else {
                $results[$schedule->getEmployee()->getId()]['schedules'][] = $schedule;
            }
        }
        
        return array_map(static function ($result, $index) {
            return new Disponibility(
                $index,
                new ArrayCollection($result["sessions"]),
                new ArrayCollection($result["schedules"]),
            );
        }, $results, array_keys($results));
        
    }
}