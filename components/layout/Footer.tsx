import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="w-full h-fit border-t border-zinc-400 dark:border-zinc-600 animate-slide-up overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="flex-between flex-col sm:flex-row gap-4">
            <Link href="/items" className="text-muted-foreground text-sm ">
              &copy; {new Date().getFullYear()} Task Website.
            </Link>
            <p className="text-muted-foreground text-sm">
              Built with Next.js, Public API and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
