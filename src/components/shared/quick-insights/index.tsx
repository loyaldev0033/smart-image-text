import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Building2,
  PlusCircle,
  Users,
  CircleArrowUpIcon,
  ClockIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/lib/view-transition";
import Image from "next/image";

interface QuickInsightsProps {
  totalFlagged: number;
  newToday: number;
  mostFlagged: string;
  mostFlaggedId: string;
  isCompany: boolean;
}

const QuickInsights: React.FC<QuickInsightsProps> = ({
  totalFlagged,
  newToday,
  mostFlagged,
  mostFlaggedId,
  isCompany,
}) => {
  return (
    <TooltipProvider>
      <Card className="hover:shadow-md transition-all duration-200 pb-5">
        <CardHeader className="bg-gray-100 rounded-t-lg border-b border-gray-200 py-4 mb-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <div>Quick Insights</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-b border-gray-100 pb-3 pt-3">
            <div className="flex items-center justify-between font-medium group cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/images/svg/crossed-flags.svg"
                    alt="flag"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-sm">Total Reviewed</span>
              </div>
              <span className="text-sm">{totalFlagged}</span>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between font-medium group cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <PlusCircle className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm">New Today</span>
              </div>
              <span className="text-sm">{newToday}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between font-medium group cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <CircleArrowUpIcon className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm">
                  Most Reviewed {isCompany ? "Company" : "Person"}
                </span>
              </div>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-sm items-center mt-2 py-2 px-3">
              <Link
                href={`/profile/${mostFlaggedId}`}
                className="text-sm font-medium hover:underline transition-colors flex items-center gap-1"
              >
                {isCompany ? (
                  <Building2 className="h-4 w-4 text-gray-500 mr-2 group-hover:scale-110 transition-transform" />
                ) : (
                  <Users className="h-4 w-4 text-gray-500 mr-2 group-hover:scale-110 transition-transform" />
                )}
                <div className="text-sm">{mostFlagged}</div>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm text-gray-500 cursor-help">
                    Updated today
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    Last updated: March 22, 2024, 9:15 AM
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default QuickInsights;
