type LogoProps = {
  /** "blue" uses the brand logo as-is; "white" inverts it for dark backgrounds. */
  tone?: "blue" | "white";
  className?: string;
};

/** Official AIESEC wordmark (uppercase). White backgrounds get the blue mark; */
/* dark backgrounds invert it to solid white. */
export default function Logo({ tone = "blue", className = "h-7" }: LogoProps) {
  return (
    <img
      src="/aiesec-logo.png"
      alt="AIESEC"
      width={1228}
      height={201}
      className={`w-auto object-contain ${tone === "white" ? "[filter:brightness(0)_invert(1)]" : ""} ${className}`}
    />
  );
}
