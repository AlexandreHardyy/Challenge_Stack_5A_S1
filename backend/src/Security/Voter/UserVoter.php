<?php

namespace App\Security\Voter;

use App\Entity\User;
use Error;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;

class UserVoter extends Voter
{
    public const CREATE = 'USER_CREATE';
    public const EDIT = 'USER_EDIT';
    public const VIEW = 'USER_VIEW';

    public function __construct(private Security $security, private RequestStack $requestStack)
    {}

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::EDIT, self::VIEW, self::CREATE]);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof User) {
            return false;
        }
        // ... (check conditions and return true to grant permission) ...
        switch ($attribute) {
            case self::CREATE:
                $bodyRequest = json_decode($this->requestStack->getCurrentRequest()->getContent());
                if ($this->security->isGranted('ROLE_PROVIDER')
                    && isset($bodyRequest->company) && $bodyRequest->company === "/api/companies/" . $user->getCompany()->getId()) {
                    return true;
                }                
                break;

            case self::EDIT:
                $bodyRequest = json_decode($this->requestStack->getCurrentRequest()->getContent());
                if (!$this->security->isGranted('ROLE_ADMIN') && isset($bodyRequest->roles)) {
                    return false;
                }
                if($user->getUserIdentifier() === $subject->getUserIdentifier())
                    return true;
                else if($this->security->isGranted('ROLE_PROVIDER') && $subject instanceof User) {
                    return $user->getCompany() === $subject->getCompany();
                }
                else if($this->security->isGranted('ROLE_ADMIN'))
                    return true;
                break;

            case self::VIEW:
                if($user->getUserIdentifier() === $subject->getUserIdentifier())
                    return true;
                else if($this->security->isGranted('ROLE_PROVIDER')) {
                    return true;  // @TODO
                }
                else if($this->security->isGranted('ROLE_ADMIN'))
                    return true;
                break;
        }

        return false;
    }
}