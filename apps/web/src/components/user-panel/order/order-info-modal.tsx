"use client";
import { type ReactNode, useState } from "react";
import Modal from "../../shared/widgets/modal";

export default function OrderInfoModal({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      showModal={open}
      setShowModal={setOpen}
      title="Отслеживать заказ"
      description="Тут вы можете посмотреть информацию о вашем заказе"
      trigger={trigger}
    >
      {/* Content goes here */}
      Content
    </Modal>
  );
}
