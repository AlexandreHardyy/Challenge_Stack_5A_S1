import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

function UserAvatar({ email, image, className }: { email: string; image: string | null; className?: string }) {
  const placeholderImage = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${email}`

  const finalImage = image ? `${import.meta.env.VITE_API_URL_PUBLIC}${image}` : placeholderImage

  return (
    <Avatar className={className}>
      <AvatarImage src={finalImage} className={className} />
      <AvatarFallback>{email[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
