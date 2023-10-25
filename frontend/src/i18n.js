import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
	fallbackLng: 'en',
		resources: {
			en: {
				landing: {
					title: "Book, Drive, Succeed. Your Future on the Fast Lane!",
					subtitle: "Our app simplifies the planning of driving lessons for multiple driving schools, optimizing the efficiency and satisfaction of instructors and students.",
					ctaDiscover: "Discover now",
					section1: {
						title: "Book, Drive, Succeed. Your Future on the Fast Lane!"
					}
				}
			},
			fr: {
				landing: {
					title: "Réservez, Roulez, Réussissez. Votre Avenir sur la Voie Rapide !",
					subtitle: "Notre application simplifie la planification des leçons de conduite pour de multiples auto-écoles, optimisant l'efficacité et la satisfaction des instructeurs et des élèves.",
					ctaDiscover: "Découvrez maintenant",
					section1: {
						title: "Réservez, Roulez, Réussissez. Votre Avenir sur la Voie Rapide !"
					}
				}
			}
		}
});
