<?php

namespace App\Repository;

use App\Entity\FeedBackBuilder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FeedBackBuilder>
 *
 * @method FeedBackBuilder|null find($id, $lockMode = null, $lockVersion = null)
 * @method FeedBackBuilder|null findOneBy(array $criteria, array $orderBy = null)
 * @method FeedBackBuilder[]    findAll()
 * @method FeedBackBuilder[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FeedBackBuilderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeedBackBuilder::class);
    }

//    /**
//     * @return FeedBackBuilder[] Returns an array of FeedBackBuilder objects
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

//    public function findOneBySomeField($value): ?FeedBackBuilder
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
