
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UpgradeSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade to Pre-Screened Status</CardTitle>
        <CardDescription>
          Get pre-screened to receive more invitations from quality landlords and agents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-800 mb-2">Benefits of Pre-Screening:</h3>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Higher visibility to property owners and agents</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Faster response times for housing applications</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Priority notifications for new listings that match your criteria</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Verified tenant badge on your profile</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-2">Pre-Screening Requirements:</h3>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Income verification (pay stubs, W2s, or bank statements)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Credit check (soft pull, won't affect your score)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Rental history verification</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Employment verification</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Start Pre-Screening Process</Button>
      </CardFooter>
    </Card>
  );
};

export default UpgradeSection;
