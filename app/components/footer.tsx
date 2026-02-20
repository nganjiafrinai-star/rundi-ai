"use client";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import "../globals.css"

const Footer = () => {
    return (
        <footer className="bg-background text-foreground py-6 border-t border-border transition-all duration-200">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                    <Link href="/dashboard" className="text-1.5xl font-bold text-foreground mb-4">RUNDI AI</Link>
                    <p className="text-sm leading-relaxed opacity-80">
                        Ibiboneka vyose kuri Rundi AI.
                        Izere ubuhinga bugezweho mu rurimi rwacu.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Plateforme</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/careers" className="hover:text-[#147E4E] transition">
                                Carrière
                            </Link>
                        </li>
                        <li>
                            <Link href="/security" className="hover:text-[#147E4E] transition">
                                Sécurité & Confiance
                            </Link>
                        </li>
                        <li>
                            <Link href="/faq" className="hover:text-[#147E4E] transition">
                                FAQ
                            </Link>
                        </li>
                        <li>
                            <Link href="/utilisation" className="hover:text-[#147E4E] transition">
                                Utilisation
                            </Link>
                        </li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Contact</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <p>
                                +257 62 489 585
                            </p>
                        </li>
                        <li>
                            <p>
                                info@afrinai.com
                            </p>
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
            <div className="border-t border-black/10 dark:border-white/10 pt-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5 text-sm opacity-60">
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
