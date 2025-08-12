import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[]) => Promise<void>;
}

const REASON_OPTIONS = [
  {
    label: "This sounds like a factual accusation",
    value: "Fact",
  },
  {
    label: "This contains hate speech or abusive language",
    value: "Hate",
  },
  {
    label: "This is false or misleading",
    value: "False",
  },
  {
    label: "This is retaliatory or targeted",
    value: "Retaliatory",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reasons, setReasons] = useState<string[]>([]);

  const handleSubmit = () => {
    onSubmit(reasons);
  };

  useEffect(() => {
    if (isOpen) {
      setReasons([]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-lg font-bold">
              Report This Review
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-gray-700 text-sm">
            RedFlag is built to protect emotional honesty—not abuse, defamation, or retaliation.
          </p>
          <p className="text-gray-700 text-sm">
            If you believe this review violates the spirit or terms of RedFlag, you can flag it for manual moderation.
          </p>
          <div className="flex flex-col gap-2">
            {
              REASON_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={option.value}
                    className="border-gray-700 data-[state=checked]:bg-gray-700"
                    checked={reasons.includes(option.value)}
                    onCheckedChange={(checked) =>
                      setReasons((prev) =>
                        checked === true
                          ? [...prev, option.value]
                          : prev.filter((reason) => reason !== option.value)
                      )
                    }
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text"
                  >
                    {option.label}
                  </label>
                </div>
              ))
            }
          </div>
          <div className="flex gap-2 w-full">
            <Button
              className="bg-green-800 hover:bg-green-900 text-white border-none w-full"
              onClick={handleSubmit}
            >
              Submit Report
            </Button>
            <Button
              className="text-gray-700 border border-gray-700 bg-white hover:bg-gray-100/80 w-full"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportReviewModal;
