<?php

namespace App\Repository;

use App\Entity\FeedBackGroup;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FeedBackGroup>
 *
 * @method FeedBackGroup|null find($id, $lockMode = null, $lockVersion = null)
 * @method FeedBackGroup|null findOneBy(array $criteria, array $orderBy = null)
 * @method FeedBackGroup[]    findAll()
 * @method FeedBackGroup[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FeedBackGroupRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeedBackGroup::class);
    }

//    /**
//     * @return FeedBackGroup[] Returns an array of FeedBackGroup objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('f.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?FeedBackGroup
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
