"use client";
import { useState } from "react";
import Modal from "../shared/widgets/modal";
import { Button } from "~/components/shared/ui/shadcn/button";
import { MessageCircleWarning } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/shared/ui/shadcn/tooltip";
import { Telegram } from "~/components/shared/icons";

export default function ReportModal() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Modal
        showModal={show}
        title="Пожаловаться"
        description="Отправьте жалобу и получите максимально быстрый ответ"
        setShowModal={setShow}
      >
        <Button className="mx-auto my-auto" variant={"outline"}>
          <Telegram className="mr-2 h-4 w-4" /> Написать в Telegram
        </Button>
      </Modal>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild onClick={() => setShow(true)}>
            <Button size={"icon"} variant={"ghost"} className="-mt-2">
              <MessageCircleWarning />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Пожаловаться</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
