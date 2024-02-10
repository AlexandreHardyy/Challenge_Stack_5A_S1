<?php
namespace App\EventSubscriber;

use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use CoopTilleuls\ForgotPasswordBundle\Event\CreateTokenEvent;
use CoopTilleuls\ForgotPasswordBundle\Event\UpdatePasswordEvent;
use GuzzleHttp\Client;
use Exception;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class ForgotPasswordEventSubscriber implements EventSubscriberInterface
{
    private $brevo;
    public function __construct(protected UserPasswordHasherInterface $hasher)
    {
        $config = Configuration::getDefaultConfiguration()->setApiKey('api-key', $_ENV["BREVO_API_KEY"]);
        $this->brevo = new TransactionalEmailsApi(new Client(), $config);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CreateTokenEvent::class => 'onCreateToken',
            UpdatePasswordEvent::class => 'onUpdatePassword',
        ];
    }

    public function onCreateToken(CreateTokenEvent $event): void
    {
        $passwordToken = $event->getPasswordToken();
        $user = $passwordToken->getUser();

        $sendSmtpEmail = new SendSmtpEmail();
        $sendSmtpEmail['sender'] = array('email'=>$_ENV["BREVO_SENDER_EMAIL"], 'name'=>'RoadWise');
        $sendSmtpEmail['to'] = array(array('email'=> $user->getEmail(), 'name'=> $user->getFirstname() . ' ' . $user->getLastname()));
        $sendSmtpEmail['subject'] = "Reset password";
        $sendSmtpEmail['templateId'] = 6;
        $sendSmtpEmail['params'] = array('reset_password_url'=> sprintf($_ENV["URL_FRONTEND"] . '/reset-password/%s', $passwordToken->getToken()));

        try {
            $this->brevo->sendTransacEmail($sendSmtpEmail);
        } catch (Exception $e) {
            return;
        }
    }

    public function onUpdatePassword(UpdatePasswordEvent $event): void
    {
        $passwordToken = $event->getPasswordToken();
        $user = $passwordToken->getUser();
        $hashedPassword = $this->hasher->hashPassword($user, $event->getPassword());
        $user->setPassword($hashedPassword);
        $user->eraseCredentials();
    }
}