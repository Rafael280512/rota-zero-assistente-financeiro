interface HoloTooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}

export default function HoloTooltip({
  active,
  payload,
  label,
  formatarValor,
}: {
  active?: boolean;
  payload?: HoloTooltipPayloadItem[];
  label?: string | number;
  formatarValor?: (valor: number) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="holo-panel rounded-sm !p-3 text-xs">
      {label !== undefined && <p className="mb-1 text-ice/50">{label}</p>}
      {payload.map((item, indice) => (
        <p key={indice} className="flex items-center gap-2 font-medium" style={{ color: item.color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}: {typeof item.value === "number" && formatarValor ? formatarValor(item.value) : item.value}
        </p>
      ))}
    </div>
  );
}
