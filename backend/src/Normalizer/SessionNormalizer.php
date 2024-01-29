<?php

namespace App\Normalizer;

use App\Entity\Session;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

final class SessionNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'SESSION_NORMALIZER_ALREADY_CALLED';

   public function __construct(
       protected Security $security,
   ){}

   public function normalize($object, string $format = null, array $context = []): mixed
   {
//       $context[self::ALREADY_CALLED] = true;

       $user = $this->security->getUser();

       if (isset($user) && isset($object) && ($user->getId() === $object->getStudent()->getId() || $user->getId() === $object->getInstructor()->getId() || $user->getRoles() === ['ROLE_ADMIN'])) {
           $context['groups'][] = 'session-group-read-collection-user';
       }

       return $this->normalizer->normalize($object, $format, $context);
   }

    public function supportsNormalization(mixed $data, string $format = null, array $context = []): bool
    {
//        if (isset($context[self::ALREADY_CALLED])) {
//            return false;
//        }
        return $data instanceof Session;
    }
}

// declare(strict_types=1);
//
// namespace App\Normalizer;
//
// use App\Entity\User;
// use App\Entity\Session;
// use Symfony\Bundle\SecurityBundle\Security;
// use Symfony\Component\Serializer\Encoder\NormalizationAwareInterface;
// use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
// use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
//
// class SessionNormalizer implements NormalizerInterface, NormalizationAwareInterface
// {
//     use NormalizerAwareTrait;
//
//     public function __construct(
//         protected Security $security,
//     )
//     {}
//
//     public function normalize(mixed $object, string $format = null, array $context = []): mixed
//     {
//         /** @var ?User $user */
//         $user = $this->security->getUser();
//
//         if ($user?->hasStudent($object) ?? false) {
//             $context['groups'][] = 'session-group-read-collection-user';
//         }
//
//         $context[__CLASS__] = true;
//
//         return $this->normalizer->normalize($object, $format, $context);
//     }
//
//     public function supportsNormalization(mixed $data, string $format = null, array $context = []): bool
//     {
//         return $data instanceof Session && !isset($context[__CLASS__]);
//     }
// }
