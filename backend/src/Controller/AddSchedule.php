<?php
namespace App\Controller;

use App\Entity\Agency;
use App\Entity\Schedule;
use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
class AddSquedule extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function __invoke(Request $request): JsonResponse
    {
        $body = json_decode($request->getContent(), true);


        if (empty($body)) {
            throw new BadRequestHttpException('Body is not set or is empty', null, JsonResponse::HTTP_BAD_REQUEST);
        }

        if (empty($body['startHour']) || empty($body['endHour']) || empty($body['dateRange'])) {
            throw new BadRequestHttpException('Invalid body parameters', null, JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $from = DateTime::createFromFormat('Y-m-d', $body['dateRange']['from']);
        $to = DateTime::createFromFormat('Y-m-d', $body['dateRange']['to']);

        if ($from === false || $to === false) {
            throw new BadRequestHttpException('Invalid rangeDate parameters', null, JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $interval = $from->diff($to);

        try {
            for($i = 0; $i <= $interval->days; $i++) {
                $this->entityManager->getRepository(Schedule::class)->deleteByDate($from->format('c'), $body['employeeId'], $body['agencyId']);

                $schedule = new Schedule();
                $schedule->setStartHour($body['startHour']);
                $schedule->setEndHour($body['endHour']);
                $schedule->setDate($from);
                $schedule->setEmployee($this->entityManager->find(User::class, $body['employeeId']));
                $schedule->setAgency($this->entityManager->find(Agency::class, $body['agencyId']));
    
                $this->entityManager->persist($schedule);
                $this->entityManager->flush();
    
                $from->modify('+1 days');
            }
        }catch (Exception $e) {
            throw new BadRequestHttpException($e->getMessage(), null, JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['message' => $schedule ], JsonResponse::HTTP_CREATED);
    }
}
