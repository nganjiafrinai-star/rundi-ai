"use client";
import { motion } from "framer-motion";
const Careers = () => {
    return (
        <section
            id="careers"
            className="min-h-screen bg-[#F2F2F2] dark:bg-gray-900 text-[#0F0F0F] dark:text-gray-100 py-26 px-6 sm:px-10 lg:px-24 overflow-hidden"
        >
            <div className="max-w-6xl mx-auto">
                <motion.header
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
                        Rejoignez notre équipe
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base  sm:text-lg">
                        Rejoignez une équipe innovante qui transforme la gestion fiscale au
                        Burundi et contribuez à la digitalisation de l’économie africaine.
                    </p>
                </motion.header>

                {/* --- Bloc Qui sommes-nous ? --- */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-10 border border-[#E5E7EB] dark:border-[#2A2A2A]"
                >
                    <h2 className="text-2xl font-bold text-[#147E4E] dark:text-indigo-400 mb-4">
                        Qui sommes-nous ?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Nous développons la première{" "}
                        <strong>Plateforme SaaS de facturation électronique intelligente</strong>{" "}
                        du Burundi, conçue pour tous les contribuables — petits, moyens et
                        grands — en collaboration officielle avec l’
                        <strong>OBR (Office Burundais des Recettes)</strong>.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
                        Notre mission est de simplifier, sécuriser et moderniser la gestion
                        fiscale grâce à l’Intelligence Artificielle, tout en favorisant
                        l’inclusion économique et la conformité.
                    </p>
                </motion.div>

                {/* --- Bloc Pourquoi nous rejoindre ? --- */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-[#E5E7EB] dark:border-[#2A2A2A]"
                >
                    <h2 className="text-2xl font-bold text-[#147E4E] dark:text-indigo-400 mb-6">
                        Pourquoi nous rejoindre ?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#F9FAFB] dark:bg-gray-900 p-6 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] hover:shadow-md transition-all duration-300">
                            <h3 className="text-xl font-semibold text-pink-400 mb-3">
                                Impact réel
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                <li>Vous participez à la transformation digitale d’un pays entier.</li>
                                <li>Votre travail aide directement des milliers d’entreprises burundaises.</li>
                                <li>Vous contribuez au développement économique national.</li>
                            </ul>
                        </div>

                        <div className="bg-[#F9FAFB] dark:bg-gray-900 p-6 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] hover:shadow-md transition-all duration-300">
                            <h3 className="text-xl font-semibold text-purple-400 mb-3">
                                Innovation continue
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                <li>Travaillez sur des technologies de pointe (IA, Cloud, SaaS).</li>
                                <li>Développez des solutions adaptées au contexte africain.</li>
                                <li>Soyez au cœur de l’innovation fiscale et numérique.</li>
                            </ul>
                        </div>

                        <div className="bg-[#F9FAFB] dark:bg-gray-900 p-6 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] hover:shadow-md transition-all duration-300">
                            <h3 className="text-xl font-semibold text-indigo-400 mb-3">
                                Environnement stimulant
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                <li>Équipe jeune, dynamique et multiculturelle.</li>
                                <li>Apprentissage continu et autonomie dès le départ.</li>
                                <li>Culture de la transparence et du feedback constructif.</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* --- Bloc Appel à action --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <p className="text-lg sm:text-xl text-gray-300 mb-6">
                        🌍 Prêt(e) à faire partie de la transformation digitale du Burundi ?
                    </p>
                    <a
                        href="https://wa.me/25767903000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition-all duration-300"
                    >
                        Rejoignez-nous dès aujourd’hui
                    </a>
                </motion.div>

            </div>
        </section>
    );
};

export default Careers;
