<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Company;
use App\Entity\Agency;
use App\Entity\Category;
use App\Entity\Service;
use App\Entity\Session;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class DataFixtures extends Fixture
{

    public function __construct(
        protected UserPasswordHasherInterface $hasher,
    ) {}

    public function load(ObjectManager $manager)
    {
        //Company
        $company1 = new Company();
        $company1->setSocialReason('Théo & Coe');
        $company1->setEmail('theojherve@gmail.com');
        $company1->setPhoneNumber('0781055200');
        $company1->setDescription('Ceci est une Entreprise d\'auto-école comprenant différentes agences');
        $company1->setIsVerified(true);
        $company1->setSiren('123456789');
        $company1->setCreatedAt(new \DateTimeImmutable('now'));
        $company1->setUpdatedAt(new \DateTimeImmutable('now'));

        $company2 = new Company();
        $company2->setSocialReason('José Auto');
        $company2->setEmail('joseauto@gmail.com');
        $company2->setPhoneNumber('0750926755');
        $company2->setDescription('Ceci est une Entreprise d\'auto-école comprenant différentes agences');
        $company2->setIsVerified(true);
        $company2->setSiren('223456789');
        $company2->setCreatedAt(new \DateTimeImmutable('now'));
        $company2->setUpdatedAt(new \DateTimeImmutable('now'));

        $manager->persist($company1);
        $manager->persist($company2);

        $manager->flush();

        //Agencies
        $agency1 = new Agency();
        $agency1->setName('La renommée');
        $agency1->setDescription('Auto-école renommée');
        $agency1->setAddress('95 rue Saint-Honoré');
        $agency1->setCity('Paris');
        $agency1->setZip('75001');
        $agency1->setGeoloc(['2.343202,48.861286']);
        $agency1->setCompany($company1);
        $agency1->setCreatedAtValue(new \DateTimeImmutable('now'));

        $agency2 = new Agency();
        $agency2->setName('Caser formation');
        $agency2->setDescription('Auto-école Caser');
        $agency2->setAddress('43 rue Guy Môquet');
        $agency2->setCity('Paris');
        $agency2->setZip('75017');
        $agency2->setGeoloc(['2.324004,48.892377']);
        $agency2->setCompany($company1);
        $agency2->setCreatedAtValue(new \DateTimeImmutable('now'));

        //company 2
        $agency3 = new Agency();
        $agency3->setName('José auto 9ème');
        $agency3->setDescription('Auto-école José');
        $agency3->setAddress('63 rue de provence');
        $agency3->setCity('Paris');
        $agency3->setZip('75009');
        $agency3->setGeoloc(['2.333641,48.874232']);
        $agency3->setCompany($company2);
        $agency3->setCreatedAtValue(new \DateTimeImmutable('now'));

        $agency4 = new Agency();
        $agency4->setName('José auto Nation');
        $agency4->setDescription('Auto-école José Nation');
        $agency4->setAddress('242 rue du faubourg Saint-Antoine');
        $agency4->setCity('Paris');
        $agency4->setZip('75001');
        $agency4->setGeoloc(['2.389665,48.849134']);
        $agency4->setCompany($company2);
        $agency4->setCreatedAtValue(new \DateTimeImmutable('now'));

        $manager->persist($agency1);
        $manager->persist($agency2);
        $manager->persist($agency3);
        $manager->persist($agency4);
        $manager->flush();

        //User
        $user = new User();
        $user->setFirstname('Théo');
        $user->setLastname('HERVÉ');
        $user->setEmail('theojherve@gmail.com');
        $user->setRoles(['ROLE_PROVIDER']);
        $hashedPassword = $this->hasher->hashPassword($user, 'Test1234');
        $user->setPassword($hashedPassword);
        $user->setPhoneNumber("+33600000000");
        $user->setIsVerified(true);
        $user->setCompany($company1);
        $user->updatedTimestamps(new \DateTimeImmutable('now'));
        $user->addAgency($agency1);
        $user->addAgency($agency2);

        $user2 = new User();
        $user2->setFirstname('Armand');
        $user2->setLastname('DFL');
        $user2->setEmail('armanddfl@gmail.com');
        $user2->setRoles(['ROLE_PROVIDER']);
        $hashedPassword = $this->hasher->hashPassword($user2, 'Test1234!');
        $user2->setPassword($hashedPassword);
        $user2->setPhoneNumber("+33600000000");
        $user2->setIsVerified(true);
        $user2->setCompany($company2);
        $user2->updatedTimestamps(new \DateTimeImmutable('now'));
        $user2->addAgency($agency3);
        $user2->addAgency($agency4);

        $manager->persist($user);
        $manager->persist($user2);
        $manager->flush();

        //Categories
        $category1 = new Category();
        $category1->setName('Permis A');
        $category1->setCompany($company1);

        $category2 = new Category();
        $category2->setName('Permis B');
        $category2->setCompany($company1);

        $category3 = new Category();
        $category3->setName('Permis A');
        $category3->setCompany($company2);

        $category4 = new Category();
        $category4->setName('Permis B');
        $category4->setCompany($company2);

        $manager->persist($category1);
        $manager->persist($category2);
        $manager->persist($category3);
        $manager->persist($category4);
        $manager->flush();

        //Services
        $service1 = new Service();
        $service1->setName('Permis A 1h');
        $service1->setDescription('Passage de permis de conduire A - 1h');
        $service1->setDuration(60);
        $service1->setPrice(60);
        $service1->setCategory($category1);
        $service1->addAgency($agency1);

        $service2 = new Service();
        $service2->setName('Permis A 2h');
        $service2->setDescription('Passage de permis de conduire A - 2h');
        $service2->setDuration(120);
        $service2->setPrice(120);
        $service2->setCategory($category1);
        $service2->addAgency($agency1);

        $service3 = new Service();
        $service3->setName('Permis B 1h');
        $service3->setDescription('Passage de permis de conduire B - 1h');
        $service3->setDuration(60);
        $service3->setPrice(60);
        $service3->setCategory($category2);
        $service3->addAgency($agency2);

        $service4 = new Service();
        $service4->setName('Permis B 2h');
        $service4->setDescription('Passage de permis de conduire B - 2h');
        $service4->setDuration(120);
        $service4->setPrice(120);
        $service4->setCategory($category2);
        $service4->addAgency($agency2);

        $service5 = new Service();
        $service5->setName('Permis B 1h');
        $service5->setDescription('Passage de permis de conduire B - 1h');
        $service5->setDuration(60);
        $service5->setPrice(60);
        $service5->setCategory($category3);
        $service5->addAgency($agency3);

        $service6 = new Service();
        $service6->setName('Permis B 2h');
        $service6->setDescription('Passage de permis de conduire B - 2h');
        $service6->setDuration(120);
        $service6->setPrice(120);
        $service6->setCategory($category3);
        $service6->addAgency($agency3);

        $service7 = new Service();
        $service7->setName('Permis B 1h');
        $service7->setDescription('Passage de permis de conduire B - 1h');
        $service7->setDuration(60);
        $service7->setPrice(60);
        $service7->setCategory($category4);
        $service7->addAgency($agency4);

        $service8 = new Service();
        $service8->setName('Permis B 2h');
        $service8->setDescription('Passage de permis de conduire B - 2h');
        $service8->setDuration(120);
        $service8->setPrice(120);
        $service8->setCategory($category4);
        $service8->addAgency($agency4);

        $manager->persist($service1);
        $manager->persist($service2);
        $manager->persist($service3);
        $manager->persist($service4);
        $manager->persist($service5);
        $manager->persist($service6);
        $manager->persist($service7);
        $manager->persist($service8);

        $manager->flush();

        $session1 = new Session();
        $session1->setStudent($user);
        $session1->setInstructor($user2);
        $session1->setStartDate(new \DateTimeImmutable('2023-06-01 10:00:00'));
        $session1->setEndDate(new \DateTimeImmutable('2023-06-01 11:00:00'));
        $session1->setService($service1);
        $session1->setAgency($agency1);
        $session1->setStatus('created');

        $session2 = new Session();
        $session2->setStudent($user);
        $session2->setInstructor($user2);
        $session2->setStartDate(new \DateTimeImmutable('2023-06-01 14:00:00'));
        $session2->setEndDate(new \DateTimeImmutable('2023-06-01 16:00:00'));
        $session2->setService($service2);
        $session2->setAgency($agency1);
        $session2->setStatus('created');

        $session3 = new Session();
        $session3->setStudent($user);
        $session3->setInstructor($user2);
        $session3->setStartDate(new \DateTimeImmutable('2023-06-02 10:00:00'));
        $session3->setEndDate(new \DateTimeImmutable('2023-06-02 11:00:00'));
        $session3->setService($service3);
        $session3->setAgency($agency2);
        $session3->setStatus('created');

        $session4 = new Session();
        $session4->setStudent($user);
        $session4->setInstructor($user2);
        $session4->setStartDate(new \DateTimeImmutable('2023-06-02 14:00:00'));
        $session4->setEndDate(new \DateTimeImmutable('2023-06-02 16:00:00'));
        $session4->setService($service4);
        $session4->setAgency($agency2);
        $session4->setStatus('created');

        $session5 = new Session();
        $session5->setStudent($user);
        $session5->setInstructor($user2);
        $session5->setStartDate(new \DateTimeImmutable('2024-01-31 10:00:00'));
        $session5->setEndDate(new \DateTimeImmutable('2024-01-31 11:00:00'));
        $session5->setService($service5);
        $session5->setAgency($agency3);
        $session5->setStatus('created');

        $session6 = new Session();
        $session6->setStudent($user);
        $session6->setInstructor($user2);
        $session6->setStartDate(new \DateTimeImmutable('2024-01-31 14:00:00'));
        $session6->setEndDate(new \DateTimeImmutable('2024-01-31 16:00:00'));
        $session6->setService($service6);
        $session6->setAgency($agency3);
        $session6->setStatus('created');

        $session7 = new Session();
        $session7->setStudent($user);
        $session7->setInstructor($user2);
        $session7->setStartDate(new \DateTimeImmutable('2024-02-01 10:00:00'));
        $session7->setEndDate(new \DateTimeImmutable('2024-02-01 11:00:00'));
        $session7->setService($service7);
        $session7->setAgency($agency4);
        $session7->setStatus('created');

        $session8 = new Session();
        $session8->setStudent($user);
        $session8->setInstructor($user2);
        $session8->setStartDate(new \DateTimeImmutable('2024-02-01 14:00:00'));
        $session8->setEndDate(new \DateTimeImmutable('2024-02-01 16:00:00'));
        $session8->setService($service8);
        $session8->setAgency($agency4);
        $session8->setStatus('created');

        $manager->persist($session1);
        $manager->persist($session2);
        $manager->persist($session3);
        $manager->persist($session4);
        $manager->persist($session5);
        $manager->persist($session6);
        $manager->persist($session7);
        $manager->persist($session8);

        $manager->flush();
    }
}
