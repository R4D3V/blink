import Image from "next/image";

export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-full border border-line shrink-0"
      style={{ width: size, height: size }}
    >
      <Image
        src="/mrnasdog-portrait.jpg"
        alt="MrNasdog"
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority
      />
    </div>
  );
}
