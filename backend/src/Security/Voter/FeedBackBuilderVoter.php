<?php

namespace App\Security\Voter;

use App\Entity\FeedBackBuilder;
use App\Entity\User;
use Error;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;

class FeedBackBuilderVoter extends Voter
{
    public const CREATE = 'FEEDBACK_BUILDER_CREATE';
    public const EDIT = 'FEEDBACK_BUILDER_EDIT';
    public const VIEW = 'FEEDBACK_BUILDER_VIEW';

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
        if (!$user instanceof User) {
            return false;
        }

        switch ($attribute) {
            case self::CREATE:
                $bodyRequest = json_decode($this->requestStack->getCurrentRequest()->getContent());
                if ($this->security->isGranted('ROLE_PROVIDER')
                    && isset($bodyRequest->company) && $bodyRequest->company === "/api/companies/" . $user->getCompany()->getId()) {
                    return true;
                }                
                break;

            case self::EDIT:
                if($this->security->isGranted('ROLE_PROVIDER') && $subject instanceof FeedBackBuilder) {
                    return $user->getCompany() === $subject->getCompany();
                }
                else if($this->security->isGranted('ROLE_ADMIN'))
                    return true;
                break;
        }

        return false;
    }
}