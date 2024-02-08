<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Twilio\Rest\Client;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Session;

class SendSmsCommand extends Command
{
    private $twilioAccountSid;
    private $twilioAuthToken;
    private $twilioPhoneNumber;
    private $entityManager;

    public function __construct($twilioAccountSid, $twilioAuthToken, $twilioPhoneNumber, EntityManagerInterface $entityManager)
    {
        parent::__construct();

        $this->twilioAccountSid = $twilioAccountSid;
        $this->twilioAuthToken = $twilioAuthToken;
        $this->twilioPhoneNumber = $twilioPhoneNumber;
        $this->entityManager = $entityManager;
    }

    protected function configure()
    {
        $this->setName('app:send-sms')
             ->setDescription('Send SMS to users for upcoming sessions.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        try {
            $tomorrowStart = new \DateTime('tomorrow');
            $tomorrowEnd = clone $tomorrowStart;
            $tomorrowEnd->modify('+1 day'); 

            $cancelledStatus = "cancelled";
            
            $sessions = $this->entityManager->getRepository(Session::class)
                ->createQueryBuilder('s')
                ->where('s.startDate >= :tomorrowStart AND s.startDate < :tomorrowEnd')
                ->andWhere('s.status != :cancelledStatus')
                ->setParameter('tomorrowStart', $tomorrowStart)
                ->setParameter('tomorrowEnd', $tomorrowEnd)
                ->setParameter('cancelledStatus', $cancelledStatus)
                ->setMaxResults(10)
                ->getQuery()
                ->getResult();

            $client = new Client($this->twilioAccountSid, $this->twilioAuthToken);

            foreach ($sessions as $session) {
                $userPhoneNumber = $session->getStudent()->getPhoneNumber();

                $instructorFirstname = $session->getInstructor()->getFirstname();
                $instructorLastname = $session->getInstructor()->getLastname();
                $agencyAddress = $session->getAgency()->getAddress();
                $startHour = date_format($session->getStartDate(), 'H:i');

                $message = "Your driving session is scheduled for tomorrow " . $startHour . "! Your instructor is " . $instructorFirstname . " " . $instructorLastname . ". The address is " . $agencyAddress;
                
                $client->messages->create(
                    $userPhoneNumber,
                    [
                        'from' => $this->twilioPhoneNumber,
                        'body' => $message,
                    ]
                );
            }

            $output->writeln('SMS sent successfully.');
            return Command::SUCCESS;

        } catch (\Exception $e) {
            $output->writeln('Error sending SMS messages: ' . $e->getMessage());
            return Command::FAILURE;
        }
        
    }
}