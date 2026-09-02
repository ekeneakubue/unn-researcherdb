import Image from "next/image";

export function UnnCrest({
  className = "h-12 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/logo.png"
      alt="University of Nigeria crest"
      width={80}
      height={96}
      className={className}
      priority={priority}
    />
  );
}
