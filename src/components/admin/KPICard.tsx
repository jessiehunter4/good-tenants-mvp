
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: number | string;
  children?: React.ReactNode;
}

const KPICard = ({ title, value, children }: KPICardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {children}
      </CardContent>
    </Card>
  );
};

export default KPICard;
