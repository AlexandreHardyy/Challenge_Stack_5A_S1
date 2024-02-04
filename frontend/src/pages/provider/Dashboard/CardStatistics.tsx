import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Loader } from "@/components/ui/loader.tsx"

const CardStatistics = ({
  title,
  titleNumber,
  subtitleNumber,
  subtitleLibelle,
  icon,
  isLoading,
}: {
  title: string
  titleNumber: number
  subtitleNumber: number
  subtitleLibelle: string
  icon: JSX.Element
  isLoading: boolean
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="text-2xl font-bold">{titleNumber}</div>
            <p className="text-xs text-muted-foreground">{subtitleLibelle + " " + subtitleNumber}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default CardStatistics
