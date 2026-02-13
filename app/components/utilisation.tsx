"use client";
import { motion } from "framer-motion";

const Utilisation = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section
            id="utilisation"
            className="min-h-screen bg-[#F2F2F2] dark:bg-gray-900 text-[#0F0F0F] dark:text-gray-100 px-6 py-26 md:px-20"
        >
            <motion.div
                className="max-w-4xl mx-auto text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                variants={fadeInUp}
            >
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
                    Guide d’utilisation
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
                    Découvrez comment utiliser efficacement la plateforme de facturation électronique.
                </p>
            </motion.div>

            <div className="max-w-5xl mx-auto space-y-10">
                {[
                    {
                        title: "Étape 1 : Inscription et configuration de votre compte",
                        content: [
                            "Rendez-vous sur la page d’inscription.",
                            "Remplissez le formulaire (nom, entreprise, NIF, email/mobile…).",
                            "Créez votre mot de passe.",
                            "Validez votre identité par code reçu (mail ou SMS).",
                            "Complétez le profil entreprise si demandé (secteur, adresse).",
                        ],
                    },
                    {
                        title: "Étape 2 : Connexion et découverte du tableau de bord",
                        content: [
                            "Connectez-vous avec vos identifiants.",
                            "Explorez les menus : Accueil, Facturation, Clients, Rapports, Support.",
                            "Configurez les préférences : langue, paramètres fiscaux, notifications.",
                        ],
                    },
                    {
                        title: "Étape 3 : Création et gestion de documents",
                        content: [
                            "Cliquez sur “Nouvelle facture”.",
                            "Sélectionnez le client, ajoutez les produits/services.",
                            "L’IA vérifie et propose d’auto-compléter les champs.",
                            "Saisissez ou validez le montant, TVA, conditions…",
                            "Génération automatique du numéro et QR code.",
                            "Visualisez, envoyez par email/SMS/WhatsApp ou téléchargez en PDF.",
                            "Autres documents (avoirs, devis…) : même procédure via le menu correspondant.",
                        ],
                    },
                    {
                        title: "Étape 4 : Transmission et conformité (connexion OBR)",
                        content: [
                            "Une fois validée, la facture est transmise automatiquement à l’OBR.",
                            "Le statut (acceptée, en attente, rejetée) apparaît dans le tableau de bord.",
                            "En cas d’erreur, l’Assistant AI explique la cause et propose une correction.",
                        ],
                    },
                    {
                        title: "Étape 5 : Gestion des clients et articles",
                        content: [
                            "Ajoutez/modifiez vos clients et produits/services en amont ou à la volée lors de la facturation.",
                        ],
                    },
                    {
                        title: "Étape 6 : Utilisation du reporting et des analyses IA",
                        content: [
                            "Explorez les statistiques (chiffre d’affaires, taxes, anomalies détectées).",
                            "Téléchargez ou exportez vos rapports.",
                            "Utilisez les prévisions et alertes AI pour anticiper vos obligations fiscales.",
                        ],
                    },
                    {
                        title: "Étape 7 : Accès à l’assistance",
                        content: [
                            "Posez une question à l’aide du chatbot ou contactez l’équipe support.",
                            "Consultez la documentation et les tutoriels intégrés.",
                        ],
                    },
                ].map(({ title, content }, index) => (
                   <motion.div
                        className="bg-white dark:bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg mt-12"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        >
                        <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
                            Bonnes pratiques :
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm md:text-base">
                            <li>Vérifiez vos données avant chaque validation.</li>
                            <li>Consultez régulièrement les alertes AI.</li>
                            <li>Gardez vos accès sécurisés et ne partagez pas vos identifiants.</li>
                            <li>Formez vos collaborateurs via les modules de formation en ligne.</li>
                        </ul>
                    </motion.div>
                ))}

                <motion.div
                    className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm mt-12"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
                        Bonnes pratiques :
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm md:text-base">
                        <li>Vérifiez vos données avant chaque validation.</li>
                        <li>Consultez régulièrement les alertes AI.</li>
                        <li>Gardez vos accès sécurisés et ne partagez pas vos identifiants.</li>
                        <li>Formez vos collaborateurs via les modules de formation en ligne.</li>
                    </ul>
                </motion.div>
            </div>
        </section>
    );
};

export default Utilisation;
