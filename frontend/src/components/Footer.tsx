import { useTranslation } from "react-i18next";

const lngs = {
  en: { nativeName: "English" },
  fr: { nativeName: "Français" },
}

const Footer = () => {
  const { i18n } = useTranslation();
  return (
    <footer className="flex justify-between px-8 py-4 bg-neutral-800 text-white h-28">
      <div>
        {Object.keys(lngs).map((lng) => (
          <button
            key={lng}
            style={{
              fontWeight: i18n.language === lng ? "bold" : "normal",
            }}
            type="submit"
            onClick={() => {
              i18n.changeLanguage(lng);
            }}
            disabled={i18n.language === lng}
          >
            { lngs[lng].nativeName }
          </button>
        ))}
      </div>
      <div>
        <p>Nous retrouver</p>
      </div>
      <div className="flex justify-center items-center">
        <p>© 2023 RoadWise, Inc.</p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>roadwise@gmail.com</p>
      </div>
    </footer>
  );
};

export default Footer;