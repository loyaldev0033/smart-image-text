import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  _id: string;
  createdAt: string;
  metadata: string;
  payAmount: number;
}

interface TransactionHistoryTableProps {
  transactions: Transaction[];
  isFetching: boolean;
}

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  transactions,
  isFetching,
}) => {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead className="text-right">Amount (USD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetching
            ? Array.from({ length: 5 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 bg-gray-200  w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 bg-gray-200 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Skeleton className="h-4 bg-gray-200 w-[150px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    {" "}
                    <Skeleton className="h-4 bg-gray-200 w-[50px]" />
                  </TableCell>
                </TableRow>
              ))
            : transactions.map((transaction) => (
                <TableRow key={transaction?._id}>
                  <TableCell className="font-medium">
                    {transaction.createdAt
                      ? format(new Date(transaction.createdAt), "MMM dd, yyyy")
                      : "Invalid Date"}
                  </TableCell>
                  <TableCell>
                    {transaction.metadata === "purchase"
                      ? "Flag Purchase"
                      : transaction.metadata}
                  </TableCell>
                  <TableCell>
                    {transaction?.payAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction?.metadata?.toLowerCase().includes("free")
                      ? "-"
                      : `$${Number((transaction?.payAmount * 1.03)?.toFixed(2)).toLocaleString()}`}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionHistoryTable;
