"use client";
import React from "react";
import { useCertificateDesigner } from "../logic/useCertificateDesigner";
import { Toolbar } from "../components/Toolbar";
import { ControlsPanel } from "../components/ControlsPanel";
import { CertificateCanvas } from "../components/CertificateCanvas";
import submitImgUpload from "../logic/submitImgUpload";
import toast from "react-hot-toast";
import { eventEmitter } from "@/utils/gloablLoading";
import { changeLoading } from "@/config/constants/keys";
import { getImageDims } from "@/utils/getImageDims";
import { TCertificateLayoutResponse } from "../types";

export default function CertificateDesignerContainer({
  id,
  defaultData,
}: {
  id: string;
  defaultData?: TCertificateLayoutResponse;
}) {
  const [state, actions, refs] = useCertificateDesigner();

  React.useEffect(() => {
    if (!defaultData) return;

    const layout: TCertificateLayoutResponse | undefined =
      (defaultData as any)?.data ?? (defaultData as any); // supports wrapped or raw

    if (layout?.templateUrl && Array.isArray(layout.fields)) {
      void actions.loadLayout(layout);
    }
  }, [defaultData]);

  const fileInputOnChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      try {
        eventEmitter.emit(changeLoading, true);
        // uploadPdf now returns { w, h }
        const { w, h } = await actions.uploadPdf(file);
        // const res = await submitImgUpload(id, {
        //   template: file,
        //   imgNatural: { w, h },
        // });
        // if (res.success) toast.success(res.message);
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload PDF");
      } finally {
        eventEmitter.emit(changeLoading, false);
      }
    } else if (file.type.startsWith("image/")) {
      try {
        eventEmitter.emit(changeLoading, true);
        // 1) read natural size upfront
        // const { w, h } = await getImageDims(file);
        // 2) update designer view
        actions.uploadImage(file);
        // 3) submit with correct dims
        // const res = await submitImgUpload(id, {
        //   template: file,
        //   imgNatural: { w, h },
        // });
        // if (res.success) toast.success(res.message);
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload image");
      } finally {
        // eventEmitter.emit(changeLoading, false);
      }
    } else {
      alert("Please upload an image or a PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toolbar state={state} actions={actions} />
      <main className="mx-auto max-w-7xl px-4 py-4 grid grid-cols-12 gap-4">
        <ControlsPanel state={state} actions={actions} />
        <div className="col-span-9 flex flex-col">
          <div className="mb-2">
            <label className="px-3 py-1.5 rounded-md border bg-white cursor-pointer text-sm inline-block">
              Upload Template (Image/PDF)
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={fileInputOnChange}
                className="hidden"
              />
            </label>
          </div>
          <CertificateCanvas
            state={state}
            actions={actions}
            refs={refs as any}
          />
        </div>
      </main>
    </div>
  );
}
