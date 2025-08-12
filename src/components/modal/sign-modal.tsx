import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { LinkedinIcon } from "lucide-react";
import { signIn } from "next-auth/react";

interface SignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignModal: React.FC<SignModalProps> = ({
  isOpen,
  onClose,
}) => {

  const handleLinkedinSignIn = () => {
    signIn("linkedin");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4 rounded-md max-w-lg" onClose={onClose}>
        <DialogHeader className="rounded-t-md p-6 flex flex-col gap-4">
          <DialogTitle className="text-center ">
            <span className="text-2xl font-bold">
              Sign In to RedFlag
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 items-center pb-10">
          <p className="text-gray-500">
            RedFlag is a private space for honest experiences.
          </p>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-3 my-4 py-4 px-8 bg-green-800 hover:bg-green-900 text-white border-none"
            onClick={handleLinkedinSignIn}
          >
            <LinkedinIcon className="w-4 h-4" />
            <span>
              Sign in with LinkedIn
            </span>
          </Button>
          <p className="text-gray-500 text-sm text-center px-8">
            You must sign in with LinkedIn to view reviews. We never post on your behalf.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignModal;
