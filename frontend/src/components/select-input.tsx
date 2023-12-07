import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SelectInputProps = {
  options: Array<{ value: string; label: string }>
  placeholder?: string
  onSelect: (val: string) => void
  className?: string
}

export const SelectInput = ({ options, placeholder = "select ...", onSelect, className }: SelectInputProps) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue className={className} placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => {
            return (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
