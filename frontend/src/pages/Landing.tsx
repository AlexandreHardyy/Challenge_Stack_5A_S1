import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import styles from "@/styles/LandingPage.module.css"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import carPro from "@/assets/img/car-pro.jpeg"
import carLandig from "@/assets/img/car-landing.png"

const Landing = () => {
  const { t } = useTranslation()
  return (
    <>
      <section className="flex justify-between gap-16 mt-14 px-8">
        <div>
          <h1 className="font-semibold text-5xl leading-relaxed">{t("landing.title")}</h1>
          <p className="py-4 text-xl text-foreground">{t("landing.subtitle")}</p>
          <Button asChild>
            <Link to={"/search"}>{t("landing.ctaDiscover")}</Link>
          </Button>
        </div>
        <img src={carLandig} className="w-2/5 rounded" alt="image homapage" />
      </section>
      <section
        id={styles.section2}
        className="mt-10 bg-secondary w-full h-screen px-8 py-32 flex justify-between gap-16"
      >
        <div>
          <h1 className="font-semibold text-5xl leading-relaxed p-6">{t("landing.section1.title")}</h1>
          <strong className="p-6 text-8xl font-bold text-primary">30 +</strong>
        </div>
        <div>
          <div className="p-6">
            <h1 className="text-xl mb-4 font-semibold">
              Un accès étendu aux auto-écoles partenaires pour une planification personnalisée
            </h1>
            <p>
              Grâce à notre solution en tant que service (SaaS), les élèves ont la possibilité aisée de rechercher et de
              choisir parmi un réseau étendu d&apos;auto-écoles partenaires, offrant ainsi une flexibilité accrue dans
              la planification de leurs leçons de conduite, tout en garantissant une expérience personnalisée et adaptée
              à leurs besoins spécifiques.
            </p>
          </div>
          <Separator />
          <div className="p-6">
            <h1 className="text-xl mb-4 font-semibold">
              Une gestion simplifiée des leçons de conduite grâce à notre plateforme innovante
            </h1>
            <p>
              Notre plateforme cloud révolutionnaire simplifie la gestion des leçons de conduite pour les instructeurs
              et les élèves, en offrant un accès transparent aux horaires disponibles, en facilitant la communication et
              la coordination entre les deux parties, et en assurant une expérience fluide et sans tracas dès le premier
              contact jusqu&apos;à l&apos;obtention du permis.
            </p>
          </div>
          <Separator />
          <div className="p-6">
            <h1 className="text-xl mb-4 font-semibold">
              Un avantage concurrentiel assuré pour les auto-écoles partenaires avec notre solution SaaS
            </h1>
            <p>
              En adoptant notre solution SaaS, les auto-écoles partenaires bénéficient d&apos;un avantage concurrentiel
              significatif en offrant à leurs clients une expérience de recherche et de réservation de cours de conduite
              intuitive et efficace
            </p>
          </div>
        </div>
      </section>
      <section className="w-full px-8 py-8 flex justify-between items-center flex-col gap-8 mb-20">
        <h1 className="font-semibold text-2xl leading-relaxed">{t("landing.newProvider.title")}</h1>
        <div className={"flex gap-12"}>
          <img src={carPro} alt="car pro" className="w-96 rounded shadow-2xl" />
          <div className={"flex flex-col gap-6"}>
            <p>
              Rejoignez notre réseau de partenaires et offrez à votre auto-école un avantage compétitif indéniable. En
              collaborant avec notre application, vous simplifierez la gestion des leçons de conduite, tout en
              augmentant l&apos;efficacité de vos instructeurs et en garantissant la satisfaction de vos élèves.
              Découvrez dès maintenant comment notre solution peut optimiser vos opérations et renforcer votre position
              sur le marché.
            </p>
            <Button size={"lg"} className={"w-fit"}>
              <Link to="/provider/new">{t("landing.newProvider.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Landing
