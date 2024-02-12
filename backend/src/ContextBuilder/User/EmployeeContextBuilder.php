<?php

declare(strict_types=1);

namespace App\ContextBuilder\User;

use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\DependencyInjection\Attribute\AutowireDecorated;
use Symfony\Component\HttpFoundation\Request;

#[AsDecorator(decorates: 'api_platform.serializer.context_builder', priority: 1000)]
class EmployeeContextBuilder implements SerializerContextBuilderInterface
{
    public function __construct(
        #[AutowireDecorated] protected SerializerContextBuilderInterface $decorated,
        protected Security $security,
    ) {}

    public function createFromRequest(Request $request, bool $normalization, array $extractedAttributes = null): array
    {
        $context = $this->decorated->createFromRequest($request, $normalization, $extractedAttributes);

        // If no groups is defined or if we are in denormalization mode (json -> to object)
        if (!isset($context['groups']) || false === $normalization) {
            return $context;
        }

        //@TODO: NEED TO BE MODIFIED
        if ($this->security->isGranted('ROLE_EMPLOYEE') || $this->security->isGranted('ROLE_PROVIDER')) {
            $context['groups'][] = 'employee:read';
        }

        if ($this->security->isGranted('ROLE_USER')) {
            $context['groups'][] = 'student:read';
        }

        return $context;
    }
}