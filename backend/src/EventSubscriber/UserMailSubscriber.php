<?php
namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use Exception;
use GuzzleHttp\Client;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class UserMailSubscriber implements EventSubscriberInterface
{
    private $brevo;

    public function __construct()
    {
        $config = Configuration::getDefaultConfiguration()->setApiKey('api-key', $_ENV["BREVO_API_KEY"]);
        $this->brevo = new TransactionalEmailsApi(new Client(), $config);
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['sendMail', EventPriorities::POST_WRITE],
        ];
    }

    public function sendMail(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        $sendSmtpEmail = new SendSmtpEmail();
        $sendSmtpEmail['sender'] = array('email'=>$_ENV["BREVO_SENDER_EMAIL"], 'name'=>'RoadWise');
        $sendSmtpEmail['to'] = array(array('email'=> $user->getEmail(), 'name'=> $user->getFirstname() . ' ' . $user->getLastname()));
        $sendSmtpEmail['subject'] = "Bienvenue sur RoadWise !";
        $sendSmtpEmail['templateId'] = 4;
        $sendSmtpEmail['params'] = array('name'=> $user->getFirstname());

        if (!$user instanceof User || Request::METHOD_POST !== $method) {
            return;
        }

        try {
            $this->brevo->sendTransacEmail($sendSmtpEmail);
        } catch (Exception $e) {
            return;
        }
    }
}