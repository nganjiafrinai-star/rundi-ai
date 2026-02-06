"use client";
import { motion } from "framer-motion";

const Security = () => {
    return (
        <section id="security" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F2F2F2] dark:bg-gray-900 text-[#0F0F0F] dark:text-white px-6 py-20">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-16 right-16 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-200"></div>
                <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-700"></div>
                <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative z-10 max-w-5xl text-center"
            >

                <p className="text-lg sm:text-xl mb-12 py-5 text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                    Chez <span className="font-semibold text-indigo-400">NEGOCE</span>, la
                    sécurité est au cœur de notre engagement. Notre plateforme repose sur
                    une infrastructure robuste, certifiée et conforme aux standards
                    internationaux, adaptée au contexte burundais.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                    {[
                        {
                            title: "🔐 Infrastructure certifiée",
                            text: "Plateforme reposant sur une infrastructure certifiée et régulièrement auditée pour garantir la sécurité des données et des opérations.",
                        },
                        {
                            title: "👤 Authentification & chiffrement",
                            text: "Accès sécurisé par authentification forte, chiffrement complet des données et surveillance continue contre les intrusions ou fraudes.",
                        },
                        {
                            title: "🚨 Alerte & reporting",
                            text: "Système d’alerte et de reporting intégré pour toute faille ou suspicion d’accès non autorisé.",
                        },
                        {
                            title: "🧾 Transparence & signalement",
                            text: "Certifications et politiques de sécurité publiques. Signalement possible via la plateforme ou l’OBR.",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-900/60 border border-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-md hover:border-indigo-500/60 hover:shadow-indigo-500/20 transition-all duration-500"
                            >
                            <h3 className="text-2xl font-semibold mb-4 text-indigo-400">
                                {item.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Security;
