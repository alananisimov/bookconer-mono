"use client";
import { DownloadIcon } from "lucide-react";
import { Button } from "~/components/shared/ui/shadcn/button";
import { api } from "~/trpc/react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function DownloadStatsBtn() {
  const { data } = api.stats.getStats.useQuery();

  async function handleDownload() {
    const docDefinition = {
      content: [
        { text: "Статистика", style: "header" },
        { text: JSON.stringify(data, null, 4) },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
      },
    };
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download(`stats ${new Date().toDateString()}.pdf`);
  }

  return (
    <>
      <Button className="hidden sm:flex" onClick={() => handleDownload()}>
        <span>Скачать статистику</span>
      </Button>
      <Button
        size={"icon"}
        className="sm:hidden"
        onClick={() => handleDownload()}
      >
        <DownloadIcon className="h-4 w-4" />
      </Button>
    </>
  );
}
