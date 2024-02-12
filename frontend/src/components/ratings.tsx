import { useTranslation } from "react-i18next"
import { Agency } from "@/utils/types.ts"
import { Rating } from "react-simple-star-rating"

export function Ratings({ ratings }: { ratings: Agency }) {
  const { t } = useTranslation()

  const sessionsWithRatings = ratings.sessions?.filter((session) => session.ratingService)

  return (
    <div className="flex flex-col gap-[17px]">
      <h2 className="text-[32px] font-bold ">{t("ratingsComponent.ratings")}</h2>
      <div className="flex flex-col gap-[20px]">
        {sessionsWithRatings?.map((session) => {
          return (
            <div key={session.id} className="flex flex-col gap-[10px] p-[20px] bg-secondary rounded-[8px]">
              <h3 className="text-[20px] font-bold ">Anonyme</h3>
              <div>
                <div className="flex items-center gap-1">
                  <p>{session.ratingService?.rating}</p>
                  <Rating
                    iconsCount={5}
                    size={25}
                    SVGclassName="inline-block"
                    initialValue={session.ratingService?.rating}
                    readonly={true}
                  />
                </div>
                <p className="mt-[5px]">{session.ratingService?.comment}</p>
              </div>
            </div>
          )
        })}
        <a className="font-semibold underline self-center">{t("ratingsComponent.seeMore")}</a>
      </div>
    </div>
  )
}
