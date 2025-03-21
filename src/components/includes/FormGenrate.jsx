import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/extension/file-uploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  FormInput,
  Paperclip,
  Upload,
} from "lucide-react";
import { useCallback } from "react";
import { useFormState } from "react-hook-form";
import { CountryDropdown } from "../extension/country-dropdown";
import { PhoneInput } from "../extension/phone-input";
import UserSelect from "./user-select";

const FileSvgDraw = ({ allowedTypes }) => {
  return (
    <>
      <Upload size={36} className="mb-2" />
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      {allowedTypes && allowedTypes.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Allowed file types: {allowedTypes?.join(", ")}
        </p>
      )}
    </>
  );
};

const FormGenerate = ({
  form,
  formFields,
  submitText,
  onFileChange,
  onSubmit,
  childern,
  className,
  hiddenFields = [],
}) => {
  const { isSubmitting } = useFormState({ control: form?.control });

  // console.log("formFields", form.getValues());

  const genrateField = useCallback(
    (field, formField, index) => {
      switch (formField.type) {
        case "text":
          return (
            <Input
              key={index}
              className={formField?.className}
              placeholder={formField?.placeholder || ""}
              {...field}
            />
          );
        case "textarea":
          return (
            <Textarea
              key={index}
              placeholder={formField?.placeholder || ""}
              {...field}
            />
          );
        case "email":
          return (
            <Input
              key={index}
              type={"email"}
              className={formField?.className}
              placeholder={formField?.placeholder || ""}
              {...field}
            />
          );
        case "number":
          return (
            <Input
              key={index}
              type="number"
              placeholder={formField?.placeholder || ""}
              min={formField?.min}
              max={formField?.max}
              className={cn("no-spinner")}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // Prevent value change with arrows
                }
              }}
              {...field}
            />
          );
        case "select":
          return (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              key={index}
            >
              <SelectTrigger className={cn("w-full")}>
                <SelectValue placeholder={formField?.placeholder || ""} />
              </SelectTrigger>
              <SelectContent className="w-full">
                {formField.options?.map((option, i) => {
                  return (
                    <SelectItem key={i} value={option.value}>
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          );
        case "date":
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}{" "}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  disabled={(date) => {
                    const today = new Date();
                    if (formField?.pastDisable) {
                      return date < today;
                    }
                    if (formField?.futureDisable) {
                      return date > today;
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          );
        case "file":
          return (
            <FileUploader
              value={field.value}
              onValueChange={(files) => {
                if (typeof onFileChange === "function") {
                  onFileChange(files, field.onChange);
                } else {
                  field.onChange(files);
                }
              }}
              dropzoneOptions={formField?.dropZoneConfig}
              reSelect={true}
              className={cn("bg-background relative rounded-lg p-2")}
            >
              <FileInput className="outline-1 outline-gray-400 outline-dashed">
                <div className="flex w-full flex-col items-center justify-center pt-3 pb-4">
                  <FileSvgDraw
                    allowedTypes={Object.values(
                      formField?.dropZoneConfig?.accept,
                    )}
                  />
                </div>
              </FileInput>
              {field.value && field.value.length > 0 && (
                <FileUploaderContent>
                  {field.value.map((file, i) => (
                    <FileUploaderItem key={i} index={i}>
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
                </FileUploaderContent>
              )}
            </FileUploader>
          );
        case "checkbox":
          return (
            <div className={cn("flex items-center gap-1")}>
              <Checkbox
                checked={field.value || false}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                }}
              />
              <div className="space-y-1 leading-none">
                {formField.placeholder}
              </div>
            </div>
          );
        case "phone":
          return (
            <PhoneInput {...field} defaultCountry="IN" autoComplete="tel" />
          );
        case "country_select":
          return (
            <CountryDropdown
              placeholder="Country"
              defaultValue={field.value}
              onChange={(country) => {
                field.onChange(country.alpha3);
              }}
            />
          );
        case "user_select":
          return (
            <UserSelect
              onValueChange={field.onChange}
              defaultValue={field.value}
              key={index}
            />
          );
        default:
          return null;
      }
    },
    [onFileChange],
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn("relative space-y-4", className)}>
        {formFields.map((formField, index) => {
          if (formField?.type == "hr") {
            return <hr key={index} className={cn(formField?.className)} />;
          }
          if (formField?.type == "heading") {
            return (
              <h1
                key={index}
                className={cn("mb-1 text-lg", formField?.className)}
              >
                {formField.label}
              </h1>
            );
          }
          if (formField?.type == "subheading") {
            return (
              <h2 key={index} className={cn("text-sm", formField?.className)}>
                {formField.label}
              </h2>
            );
          }

          return (
            <FormField
              key={index}
              name={formField.name}
              render={({ field }) => (
                <FormItem
                  className={cn(
                    formField?.className,
                    hiddenFields.includes(formField.name) && "hidden",
                  )}
                >
                  {formField?.label && (
                    <FormLabel>
                      <span>
                        {formField.label}
                        {formField.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </span>
                    </FormLabel>
                  )}
                  {formField?.description && (
                    <FormDescription>{formField.description}</FormDescription>
                  )}
                  <FormControl>
                    {genrateField(field, formField, index)}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        {childern}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full transition-transform duration-150 active:scale-95"
        >
          {isSubmitting ? "Submitting..." : submitText}
        </Button>
      </form>
    </Form>
  );
};

export default FormGenerate;
