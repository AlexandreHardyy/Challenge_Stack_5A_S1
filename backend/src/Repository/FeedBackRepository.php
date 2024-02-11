<?php

namespace App\Repository;

use App\Entity\FeedBack;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FeedBack>
 *
 * @method FeedBack|null find($id, $lockMode = null, $lockVersion = null)
 * @method FeedBack|null findOneBy(array $criteria, array $orderBy = null)
 * @method FeedBack[]    findAll()
 * @method FeedBack[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FeedBackRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeedBack::class);
    }

//    /**
//     * @return FeedBack[] Returns an array of FeedBack objects
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

//    public function findOneBySomeField($value): ?FeedBack
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
