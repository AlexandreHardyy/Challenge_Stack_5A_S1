<?php

namespace App\Security\Voter;

use App\Entity\Category;
use App\Entity\Service;
use App\Entity\User;
use Error;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

use function PHPSTORM_META\map;

class ServiceVoter extends Voter
{
    public const EDIT = 'SERVICE_EDIT';
    public const CREATE = 'SERVICE_CREATE';

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

    protected function voteOnAttribute(string $attribute, mixed $service, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        switch ($attribute) {
            case self::EDIT:
                if (
                    $service instanceof Service
                    && $this->security->isGranted('ROLE_PROVIDER') 
                    && $service->getCategory()->getCompany()->getId() === $user->getCompany()->getId()) {
                    return true;
                }     
                break;
            
            case self::CREATE:
                $bodyRequest = json_decode($this->requestStack->getCurrentRequest()->getContent());
                if ($this->security->isGranted('ROLE_PROVIDER')) {
                    foreach($user->getCompany()->getCategories()->toArray() as $category) {
                        if (isset($bodyRequest->category) && $bodyRequest->category === "/api/categories/" . $category->getId()) {
                            return true;
                        }
                    }
                }                
                break;
        }

        return false;
    }
}
