"use client";
const Politic = () => {
    return (
        <section
            id="politic"
            className="min-h-screen bg-[#F2F2F2] dark:bg-gray-900 text-[#0F0F0F] dark:text-gray-100 py-26 px-6 sm:px-10 lg:px-24"
        >
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
                        Politique de confidentialité
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Cette politique explique comment vos données personnelles sont
                        collectées, utilisées, protégées et partagées dans le cadre de
                        l’utilisation de notre plateforme SaaS de facturation électronique,
                        en conformité avec les lois du Burundi.
                    </p>
                </header>

                <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#2A2A2A] p-6 mb-6">
                    <h2 className="text-xl font-semibold text-indigo-300 mb-3">
                        Collecte et utilisation des données
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                        <li>
                            Nous collectons des informations de connexion, d’identification
                            fiscale, des données de facturation et d’utilisation de la
                            plateforme.
                        </li>
                        <li>
                            Ces informations sont exclusivement utilisées pour assurer la
                            fourniture du service, garantir la conformité fiscale avec l’OBR
                            et améliorer l’expérience utilisateur.
                        </li>
                    </ul>
                </article>

                <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#2A2A2A] p-6 mb-6">
                    <h2 className="text-xl font-semibold text-indigo-300 mb-3">
                        Partage et accès aux données
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                        <li>
                            Les données peuvent être transmises à l’OBR et aux autorités
                            compétentes, exclusivement dans le cadre légal et réglementaire.
                        </li>
                        <li>
                            Aucun partage commercial ni transmission à des tiers non autorisés
                            n’est effectué.
                        </li>
                    </ul>
                </article>

                <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#2A2A2A] p-6 mb-6">
                    <h2 className="text-xl font-semibold text-indigo-300 mb-3">
                        Sécurité et durée de conservation
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                        <li>
                            Les données sont protégées par des mesures physiques, logicielles
                            et organisationnelles conformes aux meilleures pratiques
                            internationales.
                        </li>
                        <li>
                            Elles sont conservées pendant la durée légale requise pour les
                            obligations fiscales, puis supprimées une fois ces délais
                            écoulés.
                        </li>
                    </ul>
                </article>

                <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#2A2A2A] p-6 mb-10">
                    <h2 className="text-xl font-semibold text-indigo-300 mb-3">
                        Droits des utilisateurs
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                        <li>
                            Conformément à la législation burundaise, vous pouvez demander
                            l’accès, la rectification ou la suppression de vos données,
                            sauf si une obligation légale impose leur conservation.
                        </li>
                        <li>
                            Le service est strictement réservé aux utilisateurs âgés de plus
                            de 18 ans.
                        </li>
                        <li>
                            Pour toute question ou demande relative à vos données, vous pouvez
                            contacter notre équipe via l’adresse dédiée disponible sur la
                            plateforme.
                        </li>
                    </ul>
                </article>

                <footer className="text-center text-sm text-gray-400">
                    <p>
                        Cette politique peut être mise à jour périodiquement. La version la
                        plus récente est toujours disponible sur la plateforme. Votre
                        utilisation continue du service implique votre acceptation des
                        modifications apportées.
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default Politic;
