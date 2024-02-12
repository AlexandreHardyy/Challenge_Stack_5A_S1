import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button.tsx"
import { useAuth } from "@/context/AuthContext.tsx"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUserById } from "@/services/user/user.service.ts"
import { Alert, AlertTitle } from "@/components/ui/alert.tsx"
import { AlertCircle, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useDropzone } from "react-dropzone"
import { postMedia } from "@/services/media-object.service.ts"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog.tsx"
import { toast } from "@/components/ui/use-toast.ts"

const formSchema = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  phoneNumber: z.string().regex(/^\+[1-9]\d{10,14}$/, "Must be a valid phone number with the format +33"),
})

const UserAvatar = ({ email, image }: { email: string; image: string | null }) => {
  const placeholderImage = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${email}`

  const finalImage = image ? `${import.meta.env.VITE_API_URL_PUBLIC}${image}` : placeholderImage

  return (
    <Avatar className="flex-1 flex justify-center">
      <AvatarImage src={finalImage} className="w-3/6 rounded object-cover" />
      <AvatarFallback>{email[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

const ProfileClient = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      phoneNumber: "",
    },
  })

  const updateProfile = useMutation({
    mutationFn: (newUser: { email?: string; firstname?: string; lastname?: string; image?: string }) => {
      return updateUserById(user?.id ?? 0, newUser)
    },
  })

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email)
      form.setValue("firstname", user.firstname)
      form.setValue("lastname", user.lastname)
      form.setValue("phoneNumber", user.phoneNumber)
    }
  }, [user, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProfile.mutateAsync(values)
    } catch (e) {
      form.setFocus("email")
    }
  }

  const Uploader = () => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg"],
        "image/gif": [".gif"],
      },
      maxFiles: 1,
    })

    const onUpload = async () => {
      setIsLoading(true)
      const formData = new FormData()
      acceptedFiles.forEach((image) => {
        formData.append("file", image)
      })
      try {
        const response = await postMedia(formData)
        await updateProfile.mutateAsync({ image: response.data["@id"] })
        await queryClient.invalidateQueries(["userMe"])
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "An error occured while uploading the image",
        })
        setIsLoading(false)
      }
    }

    return (
      <section className="flex flex-col gap-3">
        <div {...getRootProps({ className: "p-2 border-2" })}>
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files</p>
        </div>
        <aside>
          <div>
            {acceptedFiles.length > 0 &&
              acceptedFiles.map((image, index) => <img src={`${URL.createObjectURL(image)}`} key={index} alt="" />)}
          </div>
          {acceptedFiles.length > 0 && (
            <div className={"text-center mt-4"}>
              <Button onClick={onUpload}>Upload</Button>
            </div>
          )}
        </aside>
      </section>
    )
  }

  return (
    <div>
      <h1 className="px-6 text-3xl font-semibold">{t("header.cta.profile")}</h1>
      <div className="px-6 pt-4">
        {updateProfile.isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.form.error")} !</AlertTitle>
          </Alert>
        )}
      </div>
      <div className="px-6 pt-4">
        {updateProfile.isSuccess && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.validation.saveSuccess")} !</AlertTitle>
          </Alert>
        )}
      </div>
      <section className="w-full flex gap-4">
        <div className={"flex-1 flex flex-col"}>
          <UserAvatar email={user?.email ?? ""} image={user?.image?.contentUrl ?? null} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"link"} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("common.form.uploadImage")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Uploader />
            </DialogContent>
          </Dialog>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4 px-6 pt-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.form.email")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.form.firstName")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.form.lastName")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.form.phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={updateProfile.isLoading} type="submit">
              {updateProfile.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common.validation.saveProfile")}
            </Button>
          </form>
        </Form>
      </section>
    </div>
  )
}

export default ProfileClient
