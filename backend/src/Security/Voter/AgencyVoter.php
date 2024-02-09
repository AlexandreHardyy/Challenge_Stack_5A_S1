<?php

namespace App\Security\Voter;

use App\Entity\Agency;
use App\Entity\User;
use Error;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class AgencyVoter extends Voter
{
    public const EDIT = 'AGENCY_EDIT';
    public const CREATE = 'AGENCY_CREATE';

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

    protected function voteOnAttribute(string $attribute, mixed $agency, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        switch ($attribute) {
            case self::EDIT:
                if ($agency instanceof Agency && $this->security->isGranted('ROLE_ADMIN')) {
                    return true;
                }
                if (
                    $agency instanceof Agency
                    && $this->security->isGranted('ROLE_PROVIDER') 
                    && $agency->getCompany()->getId() === $user->getCompany()->getId()) {
                    return true;
                }
                
                break;
            case self::CREATE:
                $bodyRequest = json_decode($this->requestStack->getCurrentRequest()->getContent());
                if ($this->security->isGranted('ROLE_PROVIDER')
                    && isset($bodyRequest->company) && $bodyRequest->company === "/api/companies/" . $user->getCompany()->getId()) {
                    return true;
                }                
                break;
        }

        return false;
    }
}
