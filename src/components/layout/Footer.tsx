import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="flex h-[64px] w-full items-center justify-center border-t border-navy-border text-navy-textSecondary transition-colors hover:text-navy-primary dark:border-navyDark-border dark:text-navyDark-textSecondary dark:hover:text-navyDark-primary">
      <a 
        href="https://github.com/HaritNakbandit" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="GitHub"
        className="transition-colors hover:text-navy-primary dark:hover:text-navyDark-primary"
      >
        <FaGithub className="h-6 w-6" />
      </a>
    </footer>
  );
}