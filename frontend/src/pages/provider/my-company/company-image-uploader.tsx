import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useUpdateCompany } from "@/services/company.service"
import { postMedia } from "@/services/media-object.service"
import { Company } from "@/utils/types"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useDropzone } from "react-dropzone"

type CompanyImageUploaderProps = {
  company: Company
}

const CompanyImageUploader = ({ company }: CompanyImageUploaderProps) => {
  const queryClient = useQueryClient()
  const updateCompany = useUpdateCompany(company.id)

  const [isLoading, setIsLoading] = useState(false)

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
      await updateCompany.mutateAsync({
        image: response.data["@id"],
      })
      await queryClient.invalidateQueries(["getCompany"])
      acceptedFiles.splice(0, acceptedFiles.length)
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
            <Button disabled={isLoading} onClick={onUpload}>
              {isLoading && <Loader2 />}
              Upload
            </Button>
          </div>
        )}
      </aside>
    </section>
  )
}

export default CompanyImageUploader
