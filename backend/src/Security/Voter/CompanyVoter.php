<?php

namespace App\Security\Voter;

use App\Entity\Company;
use App\Entity\User;
use Error;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class CompanyVoter extends Voter
{
    public const EDIT = 'COMPANY_EDIT';
    public function __construct(private Security $security, private RequestStack $requestStack)
    {}

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT]);
    }

    protected function voteOnAttribute(string $attribute, mixed $company, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        if ($attribute === self::EDIT && $company instanceof Company) {
            if ($this->security->isGranted('ROLE_ADMIN')) {
                return true;
            }
            if (($this->security->isGranted('ROLE_PROVIDER') && $company->getId() === $user->getCompany()->getId())) {
                $bodyRequest = json_decode($this->requestStack->getCurrentRequest()->getContent());
                return !isset($bodyRequest->isVerified);
            }
        }

        return false;
    }
}
