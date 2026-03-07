import Link from "next/link";

type UpOneLevelButtonProps = {
  href: string;
};

export default function UpOneLevelButton({ href }: UpOneLevelButtonProps) {
  return (
    <div className="mt-6">
      <Link href={href} className="book-link">
        上一層
      </Link>
    </div>
  );
}
