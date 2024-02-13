<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\SessionRepository;
use DateTime;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\OpenApi\Model\Operation;

#[ORM\Entity(repositoryClass: SessionRepository::class)]
#[ApiResource(
    paginationEnabled: false,
    operations: [
        new Post(validationContext: ['groups' => ['session-create']], security: "is_granted('ROLE_USER')"),
        new Get(
            normalizationContext: ['groups' => ['session:read']],
            security: "is_granted('ROLE_PROVIDER') or (is_granted('ROLE_USER') and (object.getInstructor() == user or object.getStudent() == user))"
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['session:read:collection']],
            // normalizationContext: ['groups' => ['session-group-read-collection'], 'enable_max_depth' => true]
        ),
        new Patch(
            validationContext: ['groups' => ['session-group-update']],
            denormalizationContext: ['groups' => ['session-group-update']],
            security: "is_granted('ROLE_USER') and (object.getInstructor() == user or object.getStudent() == user)"
        )
    ]
)]
#[ApiResource(
    uriTemplate: '/agencies/{id}/sessions',
    security: "is_granted('ROLE_USER')",
    operations: [
        new GetCollection(
            // normalizationContext:['groups' => ['agency:read:collection:by_company'], 'enable_max_depth' => true],
            normalizationContext:['groups' => ['session:read:collection:by-agencies']],
            openapi: new Operation(
                tags: [ 'Agency', 'Session' ],
                summary: 'Returns a list of sessions for a specific agency',
                description: 'Returns a list of sessions for a specific agency'
            )
        ),
    ],
    uriVariables: [
        'id' => new Link(toProperty: 'agency', fromClass: Agency::class)
    ]
)]

#[ApiResource(
    uriTemplate: '/instructors/{id}/sessions',
    security: "is_granted('ROLE_USER')",
    operations: [
        new GetCollection(
            normalizationContext:['groups' => ['session:read:collection:by_instructor']],
            openapi: new Operation(
                tags: [ 'Agency', 'Session' ],
                summary: 'Returns a list of sessions for a specific instructor',
                description: 'Returns a list of sessions for a specific instructor'
            )
        ),
    ],
    uriVariables: [
        'id' => new Link(toProperty: 'instructor', fromClass: User::class)
    ]
)]

#[ApiResource(
    uriTemplate: '/students/{id}/sessions',
    security: "is_granted('ROLE_USER')",
    operations: [
        new GetCollection(
            normalizationContext:['groups' => ['session:read:collection:by_student']],
            openapi: new Operation(
                tags: [ 'Agency', 'Session' ],
                summary: 'Returns a list of sessions for a specific instructor',
                description: 'Returns a list of sessions for a specific instructor'
            )
        ),
    ],
    uriVariables: [
        'id' => new Link(toProperty: 'student', fromClass: User::class)
    ]
)]

#[ApiFilter(SearchFilter::class, properties: ['service' => 'exact', 'agency' => 'exact', 'status' => 'exact'])]
#[ApiFilter(DateFilter::class, properties: ['startDate'])]
class Session
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['session:read', 'session:read:collection:by_instructor', 'session:read:collection:by_student'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'studentSessions')]
    #[ORM\JoinColumn(nullable: false)]
    // SECURITY
    #[Groups(['session:read:collection:by_instructor', 'session:read'])]
    private ?User $student = null;

    #[ORM\ManyToOne(inversedBy: 'instructorSessions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['session:read', 'session:read:collection:by_student'])]
    private ?User $instructor = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['disponibility:read:collection', 'session:read:collection:by_instructor', 'session:read:collection:by_student', 'session:read'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['disponibility:read:collection', 'session:read:collection:by_instructor', 'session:read:collection:by_student', 'session:read'])]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\ManyToOne(inversedBy: 'sessions')]
    #[ORM\JoinColumn(nullable: false)]
    // SECURITY
    #[Groups(['session:read:collection:by_instructor', 'session:read:collection:by_student', 'session:read'])]
    private ?Service $service = null;

    #[ORM\ManyToOne(inversedBy: 'sessions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['session:read'])]
    private ?Agency $agency = null;

    #[ORM\Column(length: 30)]
    #[Groups(['session:read:collection:by_instructor', 'session:read:collection:by_student', 'session-group-update'])]
    private ?string $status = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['session-group-update', 'session:read'])]
    private ?float $studentMark = null;

    #[ORM\OneToOne(mappedBy: 'session', cascade: ['persist', 'remove'])]
    #[Groups(['session:read:collection:by-agencies', 'session:read'])]
    private ?RatingService $ratingService = null;

    #[ORM\OneToOne(mappedBy: 'session', cascade: ['persist', 'remove'])]
    #[Groups(['session:read'])]
    private ?FeedBack $feedBack = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStudent(): ?User
    {
        return $this->student;
    }

    public function setStudent(?User $student): static
    {
        $this->student = $student;

        return $this;
    }

    public function getInstructor(): ?User
    {
        return $this->instructor;
    }

    public function setInstructor(?User $instructor): static
    {
        $this->instructor = $instructor;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getService(): ?Service
    {
        return $this->service;
    }

    public function setService(?Service $service): static
    {
        $this->service = $service;

        return $this;
    }

    public function getAgency(): ?Agency
    {
        return $this->agency;
    }

    public function setAgency(?Agency $agency): static
    {
        $this->agency = $agency;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getStudentMark(): ?float
    {
        return $this->studentMark;
    }

    public function setStudentMark(?float $studentMark): static
    {
        $this->studentMark = $studentMark;

        return $this;
    }

    #[Assert\Callback(groups: ['session-create'])]
    public function validate(ExecutionContextInterface $context, mixed $payload): void
    {
        $toCreate = $this;

        // Check if the session is not in the past
        $today = new DateTime();
        
        if ($this->getStartDate() < $today) {
            $context->buildViolation('Your are not in back to the future')
                ->atPath('session')
                ->addViolation();
        }

        // Check if we have not a session at the same moment for the employee
        if ($this->getInstructor()->getInstructorSessions()->filter(function(Session $session) use($toCreate){
            if ($session->getStatus() == "cancelled") return false;
            if ($session->getEndDate() <= $toCreate->getStartDate()) return false;
            if ($session->getStartDate() >= $toCreate->getEndDate()) return false;

            return true;
        })->count()) {
            $context->buildViolation('Instructor is busy')
                ->atPath('instructor')
                ->addViolation();
        }

        // Check if the employee is working
        $isSessionInSchedule = $this->getInstructor()->getSchedules()->filter(function(Schedule $schedule) use($toCreate){
            $scheduleDate = $schedule->getDate();
            $scheduleStart = clone $scheduleDate;
            $scheduleEnd = clone $scheduleDate;
            date_time_set($scheduleStart, $schedule->getStartHour(), 0);
            date_time_set($scheduleEnd, $schedule->getEndHour(), 0);

            $isSessionInScheduleException = $schedule->getScheduleExceptions()->filter(function(ScheduleException $scheduleException) use($toCreate, $scheduleDate){
                if ($scheduleException->getStatus() != "VALIDATED") return false;

                $scheduleExceptionStart = clone $scheduleDate;
                $scheduleExceptionEnd = clone $scheduleDate;
                date_time_set($scheduleExceptionStart, $scheduleException->getStartHour(), 0);
                date_time_set($scheduleExceptionEnd, $scheduleException->getEndHour(), 0);

                if ($scheduleExceptionEnd <= $toCreate->getStartDate()) return false;
                if ($scheduleExceptionStart >= $toCreate->getEndDate()) return false;

                return true;
            })->count();

            if ($isSessionInScheduleException != 0) return false;
            if ($scheduleStart > $toCreate->getStartDate()) return false;
            if ($scheduleEnd < $toCreate->getEndDate()) return false;

            return true;
        })->count();

        if ($isSessionInSchedule === 0) {
            $context->buildViolation('Session not in employee schedule')
                ->atPath('instructor')
                ->addViolation();
        }
    }

    #[Assert\Callback(groups: ['session-group-update'])]
    public function validateStudentMark(ExecutionContextInterface $context, mixed $payload): void
    {
        $today = new DateTime();

        if ($this->getStudentMark() < 0 || $this->getStudentMark() > 5) {
            $context->buildViolation("You can't add a mark below 0 or above 5")
                ->atPath('studentMark')
                ->addViolation();
        }

        if ($this->getStudentMark() && $this->getStartDate() > $today) {
            $context->buildViolation("You can't add a mark if the session is not finished")
                ->atPath('studentMark')
                ->addViolation();
        }

        if ($this->getStatus() == "cancelled" && null !== $this->getStudentMark()) {
            $context->buildViolation("You can't add a mark if the session is cancelled")
                ->atPath('studentMark')
                ->addViolation();
        }
    }

    public function getRatingService(): ?RatingService
    {
        return $this->ratingService;
    }

    public function setRatingService(RatingService $ratingService): static
    {
        // set the owning side of the relation if necessary
        if ($ratingService->getSession() !== $this) {
            $ratingService->setSession($this);
        }

        $this->ratingService = $ratingService;

        return $this;
    }

    public function getFeedBack(): ?FeedBack
    {
        return $this->feedBack;
    }

    public function setFeedBack(?FeedBack $feedBack): static
    {
        // unset the owning side of the relation if necessary
        if ($feedBack === null && $this->feedBack !== null) {
            $this->feedBack->setSession(null);
        }

        // set the owning side of the relation if necessary
        if ($feedBack !== null && $feedBack->getSession() !== $this) {
            $feedBack->setSession($this);
        }

        $this->feedBack = $feedBack;

        return $this;
    }
}
