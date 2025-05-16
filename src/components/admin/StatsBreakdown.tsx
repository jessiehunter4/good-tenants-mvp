
interface StatsItemProps {
  label: string;
  value: number;
}

export const StatsItem = ({ label, value }: StatsItemProps) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

interface StatsBreakdownProps {
  items: { label: string; value: number }[];
}

const StatsBreakdown = ({ items }: StatsBreakdownProps) => {
  return (
    <div className="flex flex-col mt-2 text-sm">
      {items.map((item, index) => (
        <StatsItem key={index} label={item.label} value={item.value} />
      ))}
    </div>
  );
};

export default StatsBreakdown;
