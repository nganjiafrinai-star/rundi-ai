"use client";
import { motion } from "framer-motion";

const FAQ = () => {
    const faqs = [
        {
            question: "1. Qu’est-ce qu’une plateforme SaaS de facturation électronique ?",
            answer:
                "Il s’agit d’une solution en ligne, accessible depuis un navigateur ou un mobile, permettant de créer, envoyer et gérer des factures numériques, totalement conforme aux exigences de l’OBR et de la législation burundaise.",
        },
        {
            question: "2. À qui s’adresse la plateforme ?",
            answer:
                "La plateforme est ouverte à tous : commerçants, artisans, PME, grandes entreprises et professions libérales opérant au Burundi.",
        },
        {
            question: "3. Quels sont les prérequis pour utiliser la plateforme ?",
            answer:
                "Être enregistré fiscalement auprès de l’OBR (NIF, etc.), disposer d’un terminal ayant accès à internet (ordinateur, téléphone, tablette) et d’une adresse e-mail ou d’un numéro de mobile valide.",
        },
        {
            question: "4. Quels sont les avantages pour mon entreprise ?",
            answer:
                "Gain de temps, moins d’erreurs et conformité automatique, archivage sécurisé des factures, transmission instantanée à l’OBR, accès à l’analyse et au reporting avancé.",
        },
        {
            question: "5. Mes données sont-elles en sécurité ?",
            answer:
                "Oui, toutes les données sont encryptées, stockées sur des serveurs sécurisés et régulièrement sauvegardées.",
        },
        {
            question: "6. La plateforme est-elle conforme à l’OBR ?",
            answer:
                "Oui, elle est conçue pour être en conformité totale et intégrée avec les systèmes de l’OBR.",
        },
        {
            question: "7. Dois-je acheter ou entretenir des équipements spécifiques ?",
            answer:
                "Non, un appareil connecté suffit, aucun matériel fiscal externe n’est requis.",
        },
        {
            question: "8. Peut-on générer plusieurs types de documents ?",
            answer:
                "Oui : factures, avoirs, devis, bons de commande et rapports fiscaux, etc.",
        },
        {
            question: "9. Comment l’Intelligence Artificielle m’aide-t-elle ?",
            answer:
                "L’IA propose des suggestions, vérifie les champs, prédit des erreurs, guide pas-à-pas et aide à préparer les déclarations.",
        },
        {
            question: "10. La plateforme fonctionne-t-elle offline ?",
            answer:
                "Une connexion est requise, mais certaines actions peuvent être stockées localement pour synchronisation dès retour du réseau.",
        },
        {
            question: "11. Comment se former ou obtenir de l’aide ?",
            answer:
                "Un Assistant AI répond 24/7 aux questions. Un centre d’aide, des tutoriels et une hotline sont à disposition.",
        },
        {
            question: "12. Peut-on utiliser la plateforme en plusieurs langues ?",
            answer:
                "Oui, le français est pris en charge (anglais, swahili et kirundi à venir).",
        },
        {
            question: "13. Comment sont gérées les mises à jour ?",
            answer:
                "Aucune installation manuelle : les mises à jour sont automatiques et transparentes pour l’utilisateur.",
        },
        {
            question: "14. Quelles sont les modalités de paiement ou de tarification ?",
            answer:
                "Gratuitement ou par abonnement trimestriel, semestriel ou annuel, avec options adaptées aux différentes tailles d’entreprise.",
        },
    ];

    return (
        <section
            id="faq"
            className="min-h-screen bg-background text-foreground py-26 px-6 sm:px-10 lg:px-24"
        >
            <div className="max-w-5xl mx-auto">
                <motion.header
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
                        Foire aux Questions (FAQ)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
                        Retrouvez ici les réponses aux questions les plus fréquentes sur
                        l’utilisation de la plateforme de facturation électronique.
                    </p>
                </motion.header>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
                        >
                            <h2 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-2">
                                {faq.question}
                            </h2>
                            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.footer
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-center mt-16 text-sm text-gray-400"
                >
                    <p>
                        Si votre question ne figure pas ici, contactez notre support via la
                        plateforme pour une assistance personnalisée.
                    </p>
                </motion.footer>
            </div>
        </section>
    );
};

export default FAQ;
