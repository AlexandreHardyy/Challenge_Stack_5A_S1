<?php

namespace App\Entity\Auth;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Blog\Comment;
use App\Entity\Blog\Publication;
use App\Entity\Shop\Product;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource()]
#[ORM\Entity()]
#[ORM\Table(name: '`user`')]
class User
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name = '';

    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Publication::class)]
    private Collection $posts;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Comment::class)]
    private Collection $comments;

    #[ORM\ManyToMany(targetEntity: Product::class, mappedBy: 'buyers')]
    private Collection $products;

    public function __construct()
    {
        $this->posts = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->products = new ArrayCollection();
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(Publication $post): void
    {
        if (!$this->posts->contains($post)) {
            $this->posts->add($post);
            $post->setAuthor($this);
        }
    }

    public function removePost(Publication $post): void
    {
        if ($this->posts->removeElement($post)) {
            if ($post->getAuthor() === $this) {
                $post->setAuthor(null);
            }
        }
    }

    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): void
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setAuthor($this);
        }
    }

    public function removeComment(Comment $comment): void
    {
        if ($this->comments->removeElement($comment)) {
            if ($comment->getAuthor() === $this) {
                $comment->setAuthor(null);
            }
        }
    }

    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(Product $product): void
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
            $product->addBuyer($this);
        }
    }

    public function removeProduct(Product $product): void
    {
        if ($this->products->removeElement($product)) {
            $product->removeBuyer($this);
        }
    }

    public function hasProduct(Product $object): bool
    {
        foreach ($this->products as $product) {
            if ($product->getId() === $object->getId()) {
                return true;
            }
        }

        return false;
    }
}
