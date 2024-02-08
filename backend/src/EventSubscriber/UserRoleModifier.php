<?php
namespace App\EventSubscriber;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\HttpFoundation\RequestStack;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserRoleModifier implements EventSubscriber
{
    public function __construct(        
        private UserPasswordHasherInterface $hasher,
        private RequestStack $requestStack
    )
    {}

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
        ];
    }

    private function generatePassword($length = 16)
    {
        if (function_exists('random_bytes')) {
            $bytes = random_bytes($length / 2);
        } else {
            $bytes = openssl_random_pseudo_bytes($length / 2);
        }
        $randomString = bin2hex($bytes);
        return $randomString;
    }	

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        $request = $this->requestStack->getCurrentRequest();

        if ($entity instanceof User && $request && ($request->getPathInfo() === '/api/employees' || $request->getPathInfo() === '/api/providers')) {
            $roles = $entity->getRoles();
            $hashedPassword = $this->hasher->hashPassword($entity, $this->generatePassword());
            $entity->setPassword($hashedPassword);
            $roles[] = $request->getPathInfo() === '/api/employees' ? 'ROLE_EMPLOYEE' : 'ROLE_PROVIDER';

            $entity->setRoles(array_unique($roles));
        }
    }
}
