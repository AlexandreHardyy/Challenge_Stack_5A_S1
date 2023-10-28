import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button.tsx";
import FlagEngland from "@/assets/img/languages/FlagEngland.svg";
import FlagFrance from "@/assets/img/languages/FlagFrance.svg";

interface Language {
	nativeName: string;
}

const languages: { [key: string]: Language } = {
	en: { nativeName: "English" },
	fr: { nativeName: "Français" }
}

function LanguageSelector() {
	const { i18n } = useTranslation();

	return (
		<div className="flex items-center justify-between gap-1">
			{Object.keys(languages).map((language) => (
				<Button
					variant="ghost"
					key={language}
					style={{ fontWeight: i18n.language === language ? "bold" : "normal" }}
					type="submit"
					onClick={() => {
						i18n.changeLanguage(language).then(r => console.log(r));
					}}
					disabled={i18n.language === language}
				>
					{languages[language].nativeName === "English" ? (
						<img src={FlagEngland} alt="english flag" height="30px" width="30px" />
					) : (
						<img src={FlagFrance} alt="english flag" height="30px" width="30px" />
					)}
				</Button>
			))}
		</div>
	);
}

export default LanguageSelector;
