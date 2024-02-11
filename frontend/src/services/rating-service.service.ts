import { useMutation } from "@tanstack/react-query"
import api from "@/utils/api.ts"
import { RatingService } from "@/utils/types.ts"

export function useCreateRatingSession({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
  return useMutation({
    mutationFn: async (params: { rating: number; comment: string; service: string; session: string }) =>
      await api
        .post<RatingService>(
          `rating_services`,
          {
            rating: params.rating,
            comment: params.comment,
            service: params.service,
            session: params.session,
          },
          {
            headers: {
              "Content-Type": "application/ld+json",
            },
          }
        )
        .catch((err) => {
          throw new Error(err.response)
        }),
    onSuccess,
    onError,
    retry: false,
  })
}
