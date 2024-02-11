<?php

namespace App\Repository;

use App\Entity\RatingService;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RatingService>
 *
 * @method RatingService|null find($id, $lockMode = null, $lockVersion = null)
 * @method RatingService|null findOneBy(array $criteria, array $orderBy = null)
 * @method RatingService[]    findAll()
 * @method RatingService[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RatingServiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RatingService::class);
    }

//    /**
//     * @return RatingService[] Returns an array of RatingService objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?RatingService
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
