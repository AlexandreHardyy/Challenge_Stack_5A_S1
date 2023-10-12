import Header from "@/layouts/Header.tsx";

const Landing = () => {
  return (
    <div className="px-8">
      <Header />
      <main>
        <h1 className="font-semibold text-4xl">
          Réservez, Roulez, Réussissez : Votre Avenir sur la Voie Rapide !
        </h1>
        <p className="py-4">
          Notre application simplifie la planification des leçons de conduite
          pour de multiples auto-écoles, optimisant l'efficacité et la
          satisfaction des instructeurs et des élèves.
        </p>
      </main>
    </div>
  );
};

export default Landing;
