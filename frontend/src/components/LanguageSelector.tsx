import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button.tsx";

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
					variant="secondary"
					key={language}
					style={{ fontWeight: i18n.language === language ? "bold" : "normal" }}
					type="submit"
					onClick={() => {
						i18n.changeLanguage(language).then(r => console.log(r));
					}}
					disabled={i18n.language === language}
				>
					{ languages[language].nativeName }
				</Button>
			))}
		</div>
	);
}

export default LanguageSelector;
