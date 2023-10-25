import { useTranslation } from 'react-i18next';

const lngs = {
	en: { nativeName: "English" },
	fr: { nativeName: "Français" }
}

function LanguageSelector() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
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
	);
}

export default LanguageSelector;
