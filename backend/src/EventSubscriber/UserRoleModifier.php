<?php
namespace App\EventSubscriber;

use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Exception;
use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\RequestStack;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserRoleModifier implements EventSubscriber
{
    public function __construct(        
        private UserPasswordHasherInterface $hasher,
        private RequestStack $requestStack,
    )
    {
        $config = Configuration::getDefaultConfiguration()->setApiKey('api-key', $_ENV["BREVO_API_KEY"]);
        $this->brevo = new TransactionalEmailsApi(new Client(), $config);
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
        ];
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

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        $request = $this->requestStack->getCurrentRequest();

        if ($entity instanceof User && $request && ($request->getPathInfo() === '/api/employees' || $request->getPathInfo() === '/api/providers')) {
            $password = $this->generatePassword();
            $roles = $entity->getRoles();
            $hashedPassword = $this->hasher->hashPassword($entity, $password);
            $entity->setPassword($hashedPassword);
            $roles[] = $request->getPathInfo() === '/api/employees' ? 'ROLE_EMPLOYEE' : 'ROLE_PROVIDER';

            $entity->setRoles(array_unique($roles));

            $sendSmtpEmail = new SendSmtpEmail();
            $sendSmtpEmail['sender'] = array('email'=>$_ENV["BREVO_SENDER_EMAIL"], 'name'=>'RoadWise');
            $sendSmtpEmail['to'] = array(array('email'=> $entity->getEmail(), 'name'=> $entity->getFirstname() . ' ' . $entity->getLastname()));
            $sendSmtpEmail['subject'] = "Bienvenue chez RoadWise !";
            $sendSmtpEmail['templateId'] = 7;
            $sendSmtpEmail['params'] = array('email'=> $entity->getEmail(), 'password'=> $password);

            try {
                $this->brevo->sendTransacEmail($sendSmtpEmail);
            } catch (Exception $e) {
                return;
            }
        }
    }
}
