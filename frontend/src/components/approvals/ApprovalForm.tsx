import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import api from "../../services/api";

interface ApprovalFormProps {
  applicationId: number;
  onApproved?: () => void;
  onRejected?: () => void;
  onCancel?: () => void;
}

export default function ApprovalForm({ 
  applicationId, 
  onApproved, 
  onRejected,
  onCancel 
}: ApprovalFormProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (action: "approve" | "reject") => {
    if (!comments.trim()) {
      toast({
        title: "Error",
        description: "Please provide comments for your decision",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(`/approval-process/${applicationId}/${action}`, { comments });
      
      toast({
        title: "Success",
        description: `Application ${action}d successfully`,
      });

      if (action === "approve" && onApproved) {
        onApproved();
      } else if (action === "reject" && onRejected) {
        onRejected();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || `Failed to ${action} application`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Application</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              placeholder="Enter your review comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => handleSubmit("reject")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              onClick={() => handleSubmit("approve")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Approving..." : "Approve"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
