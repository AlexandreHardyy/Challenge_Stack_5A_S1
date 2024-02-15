<?php

namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessListener
{
public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
{
    $user = $event->getUser();

    if (!$user instanceof UserInterface || !$user->isCompanyVerified()) {
        throw new AccessDeniedHttpException('Votre compagnie n\'est pas vérifiée.');
    }

    $data = $event->getData();
    $event->setData($data);
}
}
