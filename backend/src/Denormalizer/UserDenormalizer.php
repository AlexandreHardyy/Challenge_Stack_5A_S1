<?php

namespace App\Denormalizer;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

/**
 * @method  getSupportedTypes(?string $format)
 */
class UserDenormalizer implements DenormalizerInterface
{
    use DenormalizerAwareTrait;

    public function __construct(
        protected UserPasswordHasherInterface $hasher,
        protected ObjectNormalizer $normalizer,
    ) {}

    public function supportsDenormalization(mixed $data, string $type, string $format = null): bool
    {
        return $type === User::class;
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

    public function denormalize(mixed $data, string $type, string $format = null, array $context = [])
    {
        $user = $this->normalizer->denormalize($data, $type, $format, $context);


        /** @var User $user */
        $plainPassword = $user->getPlainPassword();


        if (in_array('create-employee', $context) && !in_array('ROLE_EMPLOYEE', $user->getRoles())) {
            $user->setRoles([ 'ROLE_EMPLOYEE' ]);

            $hashedPassword = $this->hasher->hashPassword($user, $this->generatePassword());
            $user->setPassword($hashedPassword);
            $user->eraseCredentials();

            return $user;

            // @TODO send email to employee with password
        }

        if (!in_array('create-employee', $context) && empty($plainPassword)) {
            return $user;
        }

        $hashedPassword = $this->hasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);
        $user->eraseCredentials();

        return $user;
    }
}