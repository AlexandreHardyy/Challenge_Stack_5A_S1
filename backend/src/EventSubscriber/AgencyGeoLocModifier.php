<?php
namespace App\EventSubscriber;

use App\Entity\Agency;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\HttpFoundation\RequestStack;

use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class AgencyGeoLocModifier implements EventSubscriber
{
    public function __construct(        
        private RequestStack $requestStack
    )
    {}

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate
        ];
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $this->validateAddress($args);
    }

    public function preUpdate(LifecycleEventArgs $args)
    {
        $this->validateAddress($args);
    }

    private function getLatLong($address){
        try {

            $token = $_ENV["MAPBOX_TOKEN"];
            $result = file_get_contents("https://api.mapbox.com/geocoding/v5/mapbox.places/$address.json?access_token=$token");

            $json = json_decode($result);

            dump($json);

            $location = $json->{'features'}[0]->{'geometry'}->{'coordinates'};
            return $location;
        } catch(Exception $e){
            return null;
        }
        
    }	

    public function validateAddress(LifecycleEventArgs $args)
    {
        $agency = $args->getObject();
        if ($agency instanceof Agency) {

            $address = $agency->getAddress() . ',' . $agency->getCity() . ',' . $agency->getZip();
            $geoloc = $this->getLatLong($address);
            if ($geoloc === null) {
                throw new BadRequestHttpException('Invalid address', null, JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
            }

            $agency->setGeoloc($geoloc);
            $agency->setCreatedAt(New \DateTimeImmutable());
            $agency->setUpdatedAt(New \DateTimeImmutable());
        }
    }
}
