"use client";

const Footer2 = () => {
    return (
        <footer className="mt-auto w-full">
            <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground dark:text-gray-400">
                <p className="font-medium">
                    © {new Date().getFullYear()} AFRINAI
                </p>

                <div className="flex items-center gap-6">
                    <a
                        href="/condition"
                        className="hover:text-[#147E4E] dark:hover:text-[#147E4E] transition-colors duration-200 font-medium"
                    >
                        Conditions d’utilisation
                    </a>

                    <a
                        href="/policy"
                        className="hover:text-[#147E4E] dark:hover:text-[#147E4E] transition-colors duration-200 font-medium"
                    >
                        Politique de confidentialité
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer2;
