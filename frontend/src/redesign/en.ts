/**
 * Dictionnaire anglais du nouveau design, indexé par le texte français d'origine.
 * Un texte absent du dictionnaire s'affiche en français.
 */
import type { Zone } from "@/data/zones";

export const EN: Record<string, string> = {
    // Services
    "Nos services": "Our services",
    "Du dépannage express au remorquage complet": "From a quick roadside fix to a full tow",
    "Un appel suffit : on vous dit tout de suite ce qu'on peut faire et quand un dépanneur peut partir.": "One call is enough: we tell you straight away what we can do and when a driver can leave.",
    "Un seul appel : on vous dit tout de suite ce qu'on peut faire et quand un dépanneur peut partir.": "One call: we tell you straight away what we can do and when a driver can leave.",
    Remorquage: "Towing",
    "Votre véhicule est immobilisé ? Nous le remorquons vers le garage de votre choix, partout en Île-de-France, de jour comme de nuit.": "Vehicle won't move? We tow it to the garage of your choice, anywhere in the Paris region, day or night.",
    "Dépannage sur place": "Roadside repair",
    "La plupart des pannes se règlent sur place : démarrage, réparation rapide, vous repartez sans passer par le garage.": "Most breakdowns are fixed on the spot: jump start, quick repair, and you drive away without going to a garage.",
    Batterie: "Battery",
    "Batterie à plat ? Démarrage avec booster, test de charge et remplacement si besoin, directement chez vous.": "Flat battery? Jump start with a booster, charge test and replacement if needed, right where you are.",
    Crevaison: "Flat tyre",
    "Roue de secours posée sur place ou remorquage rapide vers le pneumaticien le plus proche.": "Spare wheel fitted on the spot, or a quick tow to the nearest tyre shop.",
    "Panne de carburant": "Out of fuel",
    "Essence ou diesel, on vous livre le carburant nécessaire pour rejoindre la pompe sans stress.": "Petrol or diesel, we bring you enough fuel to reach the next station without stress.",
    Désembourbage: "Vehicle recovery",
    "Véhicule enlisé dans la boue, le sable ou la neige ? Treuillage et sangles de traction pour vous sortir de là sans dégât.": "Stuck in mud, sand or snow? Winch and tow straps to get you out without damage.",
    "Chargement d'un véhicule sur plateau ADFR": "A vehicle being loaded onto an ADFR flatbed",
    "Dépanneur ADFR remplaçant une batterie sur place": "ADFR driver replacing a battery on the spot",
    "Dépannage batterie voiture sur place ADFR": "ADFR roadside battery service",
    "Remorquage d'une voiture crevée sur dépanneuse plateau ADFR": "Car with a flat tyre towed on an ADFR flatbed",
    "Dépanneur ADFR vidangeant un réservoir après une erreur de carburant": "ADFR driver draining a tank after misfuelling",
    "Désembourbage d'un 4x4 enlisé par un dépanneur ADFR": "ADFR driver recovering a stuck 4x4",
    // Types de panne (libellés ; la valeur envoyée au serveur reste en français)
    "Véhicule accidenté": "Accident",
    "Autre panne": "Other problem",
    // Engagements
    "24h/24, du dimanche au vendredi": "24/7, Sunday to Friday",
    "Intervention en moins de 30 minutes": "On site in under 30 minutes",
    "Dépannage sur place ou remorquage": "Roadside repair or towing",
    "Paiement sur place": "Pay on site",
    "Toute l'Île-de-France": "All of the Paris region",
    "Jours fériés inclus": "Public holidays included",
    // Étapes
    "Vous appelez": "You call",
    "Un coup de fil ou un message WhatsApp : dites-nous où vous êtes et ce qui s'est passé. On vous dit tout de suite quand un dépanneur peut partir.": "A phone call or a WhatsApp message: tell us where you are and what happened. We tell you straight away when a driver can leave.",
    "Le dépanneur part": "The driver sets off",
    "Le dépanneur le plus proche de votre position part immédiatement, jour et nuit, du dimanche au vendredi, jours fériés inclus.": "The driver closest to you leaves immediately, day and night, Sunday to Friday, public holidays included.",
    "Prise en charge": "We take care of it",
    "Dépannage sur place ou remorquage vers le garage de votre choix. Vous payez sur place, à la fin.": "Roadside repair or a tow to the garage of your choice. You pay on site, at the end.",
    // Galerie
    "Plateau prêt à partir": "Flatbed ready to go",
    "Véhicule arrimé, départ vers le garage": "Vehicle secured, off to the garage",
    "Intervention sous la pluie": "Call-out in the rain",
    "La dépanneuse plateau prête à partir pour une intervention en Île-de-France": "The flatbed tow truck ready to leave for a call-out in the Paris region",
    "Combi Volkswagen arrimé sur le plateau de la dépanneuse": "A Volkswagen camper secured on the flatbed",
    "Intervention de dépannage sous la pluie en Île-de-France": "A breakdown call-out in the rain in the Paris region",
    // Avis (traductions des avis Google publiés en français)
    "Avis Google · novembre 2026": "Google review · November 2026 · translated from French",
    "Un service au top du début à la fin ! Intervention rapide, professionnelle et efficace. Le dépanneur a été très sympathique, à l’écoute et réactif. Il a pris le temps de bien faire les choses et a remplacé ma batterie rapidement. Je suis entièrement satisfait de la prestation, aussi bien pour la qualité du service que pour le sérieux, le professionnalisme de l’équipe et le prix. Je recommande cette société de dépannage les yeux fermés ! Encore merci pour votre intervention et votre efficacité":
        "Top service from start to finish! Fast, professional and efficient. The driver was very friendly, attentive and responsive. He took the time to do things properly and replaced my battery quickly. I am fully satisfied, both with the quality of the service and with the seriousness and professionalism of the team, and the price. I recommend this breakdown company without hesitation! Thanks again for your help and efficiency",
    "Je recommande vivement ADFR ! J’ai fait appel à leurs services pour un dépannage de mon véhicule suite à un problème d’embrayage et je suis très satisfait. Ils sont intervenu très rapidement, équipe professionnelle, ponctuelle et très sympathique. Le dépanneur a été efficace et a pris soin de mon véhicule du début à la fin. Tarif correct et service de qualité. C’est rassurant de pouvoir compter sur une entreprise aussi sérieuse en cas de problème. Merci encore pour votre réactivité ! Je recommande à 100 % Merci à Thierry qui a été très pro":
        "I highly recommend ADFR! I called them for a breakdown after a clutch problem and I am very satisfied. They came very quickly — a professional, punctual and very friendly team. The driver was efficient and took care of my vehicle from start to finish. Fair price and quality service. It is reassuring to be able to count on such a serious company when something goes wrong. Thanks again for your responsiveness! I recommend them 100%. Thanks to Thierry, who was very professional",
    "Le service étais au top très réactif et très compétitif en terme de tarif": "The service was excellent, very responsive and very competitive on price",
    // FAQ
    "Vos questions, nos réponses directes.": "Your questions, our straight answers.",
    "Combien coûte un dépannage ou un remorquage ?": "How much does a repair or a tow cost?",
    "Le prix dépend de la distance et du type d'intervention. Il vous est annoncé au téléphone avant le départ, sans engagement.": "The price depends on the distance and the type of job. We tell you on the phone before we leave, with no commitment.",
    "Ma batterie est à plat : pouvez-vous redémarrer ma voiture sur place ?": "My battery is flat: can you restart my car on the spot?",
    "Oui, nous démarrons votre véhicule sur place et pouvons remplacer la batterie si nécessaire.": "Yes, we start your vehicle on the spot and can replace the battery if needed.",
    "Je suis en panne de carburant : pouvez-vous dépanner sur place ?": "I have run out of fuel: can you help on the spot?",
    "Oui, nous vous livrons du carburant sur place.": "Yes, we bring fuel to you.",
    "En combien de temps arrivez-vous ?": "How quickly do you arrive?",
    "En moins de 30 minutes en moyenne à Paris et en petite couronne, selon la circulation.": "In under 30 minutes on average in Paris and the inner suburbs, depending on traffic.",
    "Quelles zones couvrez-vous ?": "Which areas do you cover?",
    "Paris et toute l'Île-de-France : 75, 77, 78, 91, 92, 93, 94, 95.": "Paris and the whole Paris region: 75, 77, 78, 91, 92, 93, 94, 95.",
    "Comment se passe le paiement ?": "How do I pay?",
    "Paiement sur place à la fin de l'intervention, par carte bancaire ou en espèces.": "On site at the end of the job, by card or in cash.",
    "Que faire en cas d'accident ?": "What should I do after an accident?",
    "Mettez-vous en sécurité à l'écart de la circulation, avec gilet et triangle, puis appelez-nous au 01 85 80 00 61. Nous enlevons le véhicule et le remorquons vers le garage de votre choix.": "Get to safety away from traffic, with your hi-vis vest and warning triangle, then call us on +33 1 85 80 00 61. We remove the vehicle and tow it to the garage of your choice.",
    // Chiffres
    "Délai moyen en Île-de-France": "Average time in the Paris region",
    "Du dimanche au vendredi": "Sunday to Friday",
    "Départements couverts": "Departments covered",
    // Position
    "Géolocalisation refusée. Activez-la dans votre navigateur, ou appelez-nous et décrivez-nous où vous êtes : on arrive quand même.": "Location refused. Enable it in your browser, or call us and tell us where you are: we will still come.",
    "Impossible de déterminer votre position. Appelez-nous et décrivez-nous où vous êtes : on arrive quand même.": "We could not find your position. Call us and tell us where you are: we will still come.",
    "La recherche a pris trop de temps. Réessayez, ou appelez-nous et décrivez-nous où vous êtes : on arrive quand même.": "The search took too long. Try again, or call us and tell us where you are: we will still come.",
};

/** Textes des pages de zones en anglais (gabarits : les textes locaux rédigés n'existent qu'en français). */
export const zoneEn = {
    place: (z: Zone) => (z.type === "dept" ? `in ${z.name}` : `in ${z.name}`),
    intro: (z: Zone) => `Broken down ${z.type === "dept" ? `in ${z.name}` : `in ${z.name}, near ${z.spots[0]}`}? ADFR drivers reach you in under 30 minutes on average, 24/7 from Sunday to Friday, public holidays included.`,
    local: (z: Zone) =>
        `Our drivers know ${z.name} and its main roads. Battery, flat tyre, fuel, accident or towing: in most cases everything is sorted on the spot and you drive away. We work in town and on national and local roads.`,
    interventions: (name: string) => [
        `Flat battery in the morning, outside your home or in your car park in ${name}`,
        "Flat tyre in town or at the roadside",
        "Out of fuel far from a petrol station",
        "Car broken down in an underground car park or in heavy traffic",
        "Vehicle to be removed to a garage after an accident",
        "Car immobilised by a mechanical or electrical fault",
    ],
    faq: (name: string) => [
        { q: `Do you really work 24/7 in ${name}?`, a: `Yes. In ${name}, as everywhere in the Paris region, an ADFR driver can set off day or night, from Sunday to Friday, public holidays included.` },
        { q: `How quickly does a driver arrive in ${name}?`, a: `In under 30 minutes on average in ${name} and the neighbouring towns, depending on traffic.` },
        { q: `Can I pay on site in ${name}?`, a: "Yes. You pay after the job, on site, by card or in cash." },
    ],
};
