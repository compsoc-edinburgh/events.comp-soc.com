import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon
} from "@radix-ui/react-icons";
import type { CSSProperties } from "react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-neutral-800 group-[.toaster]:text-white group-[.toaster]:border-neutral-700 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-neutral-300",
          actionButton:
            "group-[.toast]:bg-neutral-700 group-[.toast]:text-white group-[.toast]:hover:bg-neutral-600",
          cancelButton:
            "group-[.toast]:bg-neutral-800 group-[.toast]:text-neutral-300 group-[.toast]:hover:bg-neutral-700"
        }
      }}
      icons={{
        success: <CheckCircledIcon className="size-4 text-green-400" />,
        info: <InfoCircledIcon className="size-4 text-blue-400" />,
        warning: <ExclamationTriangleIcon className="size-4 text-yellow-400" />,
        error: <CrossCircledIcon className="size-4 text-red-400" />
      }}
      style={
        {
          "--normal-bg": "#262626",
          "--normal-text": "#ededed",
          "--normal-border": "#404040",
          "--border-radius": "0.5rem"
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
