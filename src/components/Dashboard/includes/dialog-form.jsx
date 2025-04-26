import FormGenerate from "@/components/includes/FormGenrate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DialogForm({
  title,
  description,
  submitText,
  isOpen,
  onClose,
  formFields,
  form,
  onSubmit,
  onFileChange,
  hiddenFields = [],
  disabledFields = [],
  specialProps = [],
  children,
}) {
 

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="">
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className={"max-h-[70vh] ps-2 pe-4"}>
          <FormGenerate
            className=""
            form={form}
            onSubmit={onSubmit}
            formFields={formFields}
            submitText={submitText}
            onFileChange={onFileChange}
            hiddenFields={hiddenFields}
            disabledFields={disabledFields}
            specialProps={specialProps}
          >
            {children}
          </FormGenerate>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
