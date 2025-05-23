
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IntegrationRequest } from "@/types/integrations";
import { Check, X, Clock } from "lucide-react";

interface IntegrationRequestsTableProps {
  requests: IntegrationRequest[];
  onStatusUpdate: (id: string, status: IntegrationRequest['status'], notes?: string) => void;
}

const IntegrationRequestsTable = ({ requests, onStatusUpdate }: IntegrationRequestsTableProps) => {
  const getPriorityColor = (priority: IntegrationRequest['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: IntegrationRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'in_development':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-600';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Integration</TableHead>
          <TableHead>Requested By</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Justification</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              <div>
                <div className="font-medium">{request.integration_name}</div>
                <div className="text-sm text-gray-500">{request.provider_name}</div>
              </div>
            </TableCell>
            <TableCell>{request.user?.email}</TableCell>
            <TableCell>
              <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                {request.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={`${getStatusColor(request.status)} text-white`}>
                {request.status}
              </Badge>
            </TableCell>
            <TableCell className="max-w-xs truncate">
              {request.business_justification}
            </TableCell>
            <TableCell>
              {new Date(request.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {request.status === 'pending' && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(request.id, 'approved')}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusUpdate(request.id, 'rejected')}
                    className="flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Reject
                  </Button>
                </div>
              )}
              {request.status === 'approved' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusUpdate(request.id, 'in_development')}
                  className="flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  Start Dev
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default IntegrationRequestsTable;
