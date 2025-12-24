interface CurrencyIcon {
  className?: string;
  size?: string;
}
const CurrencySybmole: React.FC<CurrencyIcon> = ({ className, size = '20px' }) => (
  <span className={`text-[#7286F7] ${className}`} style={{ fontSize: size }}>
    <span className="icon-saudi_riyal font-bold " />
  </span>
);
export default CurrencySybmole;
