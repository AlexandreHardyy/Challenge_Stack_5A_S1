import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { useState } from "react"
import { searchFilters } from "."

const searchFormSchema = z.object({
  name: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
  address: z.string().max(50).optional(),
  city: z.string().max(50).optional(),
  zip: z.string().max(50).optional()
})

type SearchFormProps = {
  setFilters: React.Dispatch<searchFilters>
}

function SearchForm ({setFilters}: SearchFormProps) {
  const [enabledInput, setEnabledInput] = useState<string[]>([])
  
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema)
  })

  function onSubmit(values: z.infer<typeof searchFormSchema>) {
    console.log(values)
    setFilters(values)
  }

  return (
    <section>
      <ToggleGroup onValueChange={setEnabledInput} variant="outline" type="multiple">
        <ToggleGroupItem className="data-[state=on]:text-primary" value="category" aria-label="Toggle bold">
          Category
        </ToggleGroupItem>
        <ToggleGroupItem className="data-[state=on]:text-primary" value="location" aria-label="Toggle italic">
          Location
        </ToggleGroupItem>
      </ToggleGroup>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            defaultValue=""
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="The Company or Agency name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {enabledInput.includes('category') && <FormField
            control={form.control}
            defaultValue=""
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Category of service" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />}
          {enabledInput.includes('location') && <div className="flex gap-2">
            <FormField
              control={form.control}
              defaultValue=""
              name="address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a streat name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue=""
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a city name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue=""
              name="zip"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a zip code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </section>
  )
}

export default SearchForm