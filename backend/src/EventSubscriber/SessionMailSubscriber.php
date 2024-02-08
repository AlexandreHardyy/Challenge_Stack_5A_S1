<?php
namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Session;
use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use Exception;
use GuzzleHttp\Client;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class SessionMailSubscriber implements EventSubscriberInterface
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
        $session = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$session instanceof Session || Request::METHOD_POST !== $method) {
            return;
        }

        $sendSmtpEmail = new SendSmtpEmail();
        $sendSmtpEmail['sender'] = array('email'=>$_ENV["BREVO_SENDER_EMAIL"], 'name'=>'RoadWise');
        $sendSmtpEmail['to'] = array(array('email'=> $session->getInstructor()->getEmail(), 'name'=> $session->getInstructor()->getFirstname() . ' ' . $session->getInstructor()->getLastname()));
        $sendSmtpEmail['subject'] = "Vous avez une nouvelle session de prévu !";
        $sendSmtpEmail['templateId'] = 5;
        $sendSmtpEmail['params'] = array('name'=> $session->getInstructor()->getFirstname(),
            'date'=> $session->getStartDate()->format('d/m/Y'),
            'hour_start' => $session->getStartDate()->format('H:i'),
            'hour_end' => $session->getEndDate()->format('H:i'),
            'student' => $session->getStudent()->getFirstname() . ' ' . $session->getStudent()->getLastname());

        try {
            $this->brevo->sendTransacEmail($sendSmtpEmail);
        } catch (Exception $e) {
            return;
        }
    }
}