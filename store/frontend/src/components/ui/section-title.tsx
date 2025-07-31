import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from 'next/navigation';

interface SectionTitleProps {
  title: string;
  description?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export function SectionTitle({ 
  title, 
  description, 
  viewAllLink, 
  viewAllText,
  className = "" 
}: SectionTitleProps) {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {viewAllLink && viewAllText && (
        <Link href={`/${locale}${viewAllLink}`}>
          <Button variant="outline">
            {viewAllText}
          </Button>
        </Link>
      )}
    </div>
  );
}