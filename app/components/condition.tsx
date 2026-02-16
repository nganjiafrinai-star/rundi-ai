
const Condition = () => {
    return (
        <section
            id="condition"
            className="min-h-screen bg-background text-foreground py-26 px-6 sm:px-10 lg:px-24"
        >
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
                        Conditions d’utilisation
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Votre accès et utilisation de la plateforme SaaS sont soumis à ces
                        conditions d’utilisation, ainsi qu’aux lois en vigueur au Burundi. En
                        utilisant la plateforme, vous acceptez ces conditions, qui encadrent vos
                        droits et responsabilités.
                    </p>
                </header>

                <article className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
                    <h2 className="text-xl font-semibold text-[#147E4E] dark:text-indigo-400 mb-3">
                        Droits d’accès et utilisation
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-300">
                        <li>
                            Vous disposez d’un droit <span className="font-semibold">non
                                exclusif</span>, non transférable et révocable d’utiliser la plateforme
                            pour gérer vos factures et déclarations fiscales auprès de l’OBR.
                        </li>
                        <li>
                            Toute utilisation non autorisée ou frauduleuse de la plateforme est
                            strictement interdite.
                        </li>
                        <li>
                            Toute tentative de modification, de copie, de reverse engineering ou
                            de création d’un produit dérivé à partir de la plateforme est
                            interdite.
                        </li>
                        <li>
                            La plateforme est réservée aux entreprises et individus enregistrés
                            au Burundi ; toute utilisation non autorisée est proscrite.
                        </li>
                    </ul>
                </article>

                <article className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
                    <h2 className="text-xl font-semibold text-[#147E4E] dark:text-indigo-400 mb-3">
                        Propriété intellectuelle
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        L’éditeur détient l’ensemble des droits relatifs à la plateforme, ses
                        interfaces, fonctionnalités, données, codes et contenus. Les
                        suggestions, retours et contributions peuvent être librement utilisés
                        par l’éditeur pour améliorer le service sans contrepartie.
                    </p>
                </article>

                <article className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
                    <h2 className="text-xl font-semibold text-[#147E4E] dark:text-indigo-400 mb-3">
                        Support et résiliation
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-300">
                        <li>
                            L’accès à votre compte peut être suspendu ou résilié en cas de
                            non-respect des présentes conditions, de fraude avérée ou sur
                            décision de l’OBR.
                        </li>
                        <li>
                            Vous pouvez demander la fermeture de votre compte à tout moment en
                            contactant le support selon la procédure disponible sur la plateforme.
                        </li>
                    </ul>
                </article>

                <article className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
                    <h2 className="text-xl font-semibold text-[#147E4E] dark:text-indigo-400 mb-3">
                        Limitation de responsabilité
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        La plateforme est fournie en l’état, sans garantie d’absence d’erreur,
                        de continuité de service ou de conformité absolue. L’éditeur ne saurait
                        être tenu responsable des dommages indirects, pertes de données ou
                        interruptions d’activité résultant de l’utilisation de la plateforme.
                    </p>
                </article>

                <article className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-10">
                    <h2 className="text-xl font-semibold text-[#147E4E] dark:text-indigo-400 mb-3">
                        Indemnisation
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Vous acceptez d’indemniser et de tenir indemne l’éditeur de toute
                        réclamation, perte ou dépense résultant d’une utilisation non conforme
                        de la plateforme, d’une violation des présentes conditions ou d’une
                        infraction à la législation fiscale burundaise.
                    </p>
                </article>

                <footer className="text-center text-sm text-gray-400">
                    <p>
                        Ces conditions peuvent être mises à jour. Veuillez consulter la
                        dernière version disponible sur la plateforme. Pour toute question,
                        contactez le support.
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default Condition;
