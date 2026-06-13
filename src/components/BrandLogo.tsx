import Image from "next/image";

export default function BrandLogo({ size = 20 }: { size?: number }) {
  return (
    <Image
      src="/preflight-logo.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      loading="eager"
      className="shrink-0 rounded-[5px]"
    />
  );
}
