"use client";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import "../globals.css"

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 py-12 border-t border-black/10 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                    <h2 className="text-1.5xl font-bold text-[#111111] dark:text-white mb-4">RUNDI AI</h2>
                    <p className="text-sm leading-relaxed opacity-80">
                        Ibiboneka vyose kuri Rundi AI.
                        Izere ubwenge bw'ubugezweho mu rurimi rwacu.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#111111] dark:text-white">SaaS Plateforme</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="/careers" className="hover:text-[#28C766] transition">
                                Carrière
                            </a>
                        </li>
                        <li>
                            <a href="/security" className="hover:text-[#28C766] transition">
                                Sécurité & Confiance
                            </a>
                        </li>
                        <li>
                            <a href="/faq" className="hover:text-[#28C766] transition">
                                FAQ
                            </a>
                        </li>
                        <li>
                            <a href="/utilisation" className="hover:text-[#28C766] transition">
                                Utilisation
                            </a>
                        </li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#111111] dark:text-white">Contact</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="tel:+25767903000" className="hover:text-[#28C766] transition">
                                +257 67 903 000
                            </a>
                        </li>
                        <li>
                            <a href="mailto:info@bi-wep.bi" className="hover:text-[#28C766] transition">
                                info@bi-wep.bi
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#111111] dark:text-white">Réseaux sociaux</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-[#28C766] transition">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="hover:text-[#28C766] transition">
                            <Youtube size={20} />
                        </a>
                        <a href="#" className="hover:text-[#28C766] transition">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.244 2H21l-6.76 7.73L21.5 22h-5.03l-4.08-5.96L7.66 22H4.91l7.18-8.21L3.5 2h5.16l3.7 5.38L18.24 2z" />
                            </svg>
                        </a>
                        <a href="#" className="hover:text-[#28C766] transition">
                            <Linkedin size={20} />
                        </a>
                        <a href="#" className="hover:text-[#28C766] transition">
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="p-6 pb-[-6px] border-t border-black/10 dark:border-white/10 pt-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5 text-sm opacity-60">
                <p>&copy; {new Date().getFullYear()} AFRINAI. Tous droits réservés.</p>
                <div className="flex space-x-5">
                    <a href="/condition" className="hover:text-[#28C766] transition">
                        Conditions d’utilisation
                    </a>
                    <a href="/politic" className="hover:text-[#28C766] transition">
                        Politique de confidentialité
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
