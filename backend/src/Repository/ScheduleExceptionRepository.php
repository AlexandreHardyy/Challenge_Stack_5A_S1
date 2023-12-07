<?php

namespace App\Repository;

use App\Entity\ScheduleException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ScheduleException>
 *
 * @method ScheduleException|null find($id, $lockMode = null, $lockVersion = null)
 * @method ScheduleException|null findOneBy(array $criteria, array $orderBy = null)
 * @method ScheduleException[]    findAll()
 * @method ScheduleException[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ScheduleExceptionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ScheduleException::class);
    }

//    /**
//     * @return ScheduleException[] Returns an array of ScheduleException objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ScheduleException
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
