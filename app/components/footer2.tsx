"use client";

const Footer2 = () => {
    return (
        <footer className="mt-auto w-full bg-transparent text-gray-700 dark:text-gray-300">
            <div className="sticky bottom-0 px-6 py-4 max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-3 text-sm opacity-60">
                <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} AFRINAI. Tous droits réservés.</p>
                <div className="flex flex-wrap items-center justify-center gap-4">
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

export default Footer2;
