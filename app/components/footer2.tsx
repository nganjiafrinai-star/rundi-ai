"use client";

const Footer2 = () => {
    return (
        <footer className="mt-auto w-full bg-background">
  <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">

    <p>
      © {new Date().getFullYear()} AFRINAI
    </p>

    <div className="flex items-center gap-6">
      <a
        href="/condition"
        className="hover:text-foreground transition-colors"
      >
        Conditions
      </a>

      <a
        href="/politic"
        className="hover:text-foreground transition-colors"
      >
        Privacy
      </a>
    </div>

  </div>
</footer>

    );
};

export default Footer2;
