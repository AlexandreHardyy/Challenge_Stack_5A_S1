<?php

namespace App\Security\Voter;

use App\Entity\Category;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class CategoryVoter extends Voter
{
    public const EDIT = 'CATEGORY_EDIT';
    public const CREATE = 'CATEGORY_CREATE';

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

    protected function voteOnAttribute(string $attribute, mixed $category, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        switch ($attribute) {
            case self::EDIT:
                if (
                    $category instanceof Category
                    && $this->security->isGranted('ROLE_PROVIDER') 
                    && $category->getCompany()->getId() === $user->getCompany()->getId()) {
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
