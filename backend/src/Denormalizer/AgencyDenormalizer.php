<?php

namespace App\Denormalizer;

use App\Entity\Agency;
use Error;
use Exception;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

/**
 * @method  getSupportedTypes(?string $format)
 */
class AgencyDenormalizer implements DenormalizerInterface
{
    use DenormalizerAwareTrait;

    public function __construct(
        protected ObjectNormalizer $normalizer,
    ) {}

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

    public function supportsDenormalization(mixed $data, string $type, string $format = null): bool
    {
        return $type === Agency::class;
    }

    public function denormalize(mixed $data, string $type, string $format = null, array $context = [])
    {
        $agency = $this->normalizer->denormalize($data, $type, $format, $context);


        /** @var Agency $agency */
        $agency->setCreatedAt(New \DateTimeImmutable());
        $agency->setUpdatedAt(New \DateTimeImmutable());

        $address = $agency->getAddress() . ',' . $agency->getCity() . ',' . $agency->getZip();

        $geoloc = $this->getLatLong($address);
        if ($geoloc === null) {
            return $agency;
        }

        $agency->setGeoloc($geoloc);

        return $agency;
    }
}