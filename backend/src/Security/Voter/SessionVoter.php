<?php

namespace App\Security\Voter;

use App\Entity\Session;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;


class SessionVoter extends Voter
{
    public const EDIT = 'SESSION_EDIT';
    public const CREATE = 'SESSION_CREATE';

    private $security = null;
    private $requestStack = null;
    public function __construct(Security $security, RequestStack $requestStack)
    {
        $this->security = $security;
        $this->requestStack = $requestStack;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::CREATE]);
    }

    protected function voteOnAttribute(string $attribute, mixed $session, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        switch ($attribute) {
            case self::EDIT:
                if (
                    $session instanceof Session
                    && $this->security->isGranted('ROLE_USER') 
                    && ($session->getStudent()->getId() === $user->getId() || $session->getInstructor()->getId() === $user->getId())) {
                    return true;
                }     
                break;
            
            case self::CREATE:
                $bodyRequest = json_decode($this->requestStack->getCurrentRequest()->getContent());
                if ($this->security->isGranted('ROLE_USER')
                    && isset($bodyRequest->student) && $bodyRequest->student === "/api/users/" . $user->getId()) {
                    return true;
                }                
                break;
        }

        return false;
    }
}
