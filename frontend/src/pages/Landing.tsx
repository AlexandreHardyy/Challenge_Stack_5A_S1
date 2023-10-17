import UndrawMeeting from "@/assets/img/UndrawMeeting.svg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import styles from "@/styles/LandingPage.module.css";

const Landing = () => {
  return (
    <>
      <section className="flex justify-between gap-16 mt-14 px-8">
        <div>
          <h1 className="font-semibold text-5xl leading-relaxed">
            Réservez, Roulez, Réussissez. Votre Avenir sur la Voie Rapide !
          </h1>
          <p className="py-4 text-xl text-gray-500">
            Notre application simplifie la planification des leçons de conduite
            pour de multiples auto-écoles, optimisant l'efficacité et la
            satisfaction des instructeurs et des élèves.
          </p>
          <Button>Discover now</Button>
        </div>
        <img src={UndrawMeeting} className="w-2/5" alt="image homapage" />
      </section>
      <section
        id={styles.section2}
        className="mt-10 bg-slate-100 w-full h-screen px-8 py-32 flex justify-between gap-16"
      >
        <div>
          <h1 className="font-semibold text-5xl leading-relaxed p-6">
            Réservez, Roulez, Réussissez. Votre Avenir sur la Voie Rapide
          </h1>
          <strong className="p-6 text-8xl font-bold text-primary">30 +</strong>
        </div>
        <div>
          <div className="p-6">
            <h1 className="text-xl mb-4 font-semibold">title 1</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
              at cum est hic magni nisi odit recusandae soluta, veritatis vitae.
              Aliquam aspernatur commodi dolorem ea excepturi officia, ratione
              rem veniam!
            </p>
          </div>
          <Separator />
          <div className="p-6">
            <h1 className="text-xl mb-4 font-semibold">title 2</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
              at cum est hic magni nisi odit recusandae soluta, veritatis vitae.
              Aliquam aspernatur commodi dolorem ea excepturi officia, ratione
              rem veniam!
            </p>
          </div>
          <Separator />
          <div className="p-6">
            <h1 className="text-xl mb-4 font-semibold">title 2</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
              at cum est hic magni nisi odit recusandae soluta, veritatis vitae.
              Aliquam aspernatur commodi dolorem ea excepturi officia, ratione
              rem veniam!
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
