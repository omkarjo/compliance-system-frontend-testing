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
import { Calendar as CalendarIcon, Paperclip, Upload } from "lucide-react";
import { memo, useMemo } from "react";
import { useFormState } from "react-hook-form";
import { CountryDropdown } from "../extension/country-dropdown";
import { PhoneInput } from "../extension/phone-input";
import { TagsInput, tagsInputFieldGenerator } from "./tags-input";
import UserSelect from "./user-select";

const FileSvgDraw = memo(({ allowedTypes }) => (
  <>
    <Upload size={36} className="mb-2" />
    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
      <span className="font-semibold">Click to upload</span>
      &nbsp; or drag and drop
    </p>
    {allowedTypes?.length > 0 && (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Allowed file types: {allowedTypes.join(", ")}
      </p>
    )}
  </>
));

FileSvgDraw.displayName = "FileSvgDraw";

const HeadingField = memo(({ label, className }) => (
  <h1 className={cn("mb-1 text-lg", className)}>{label}</h1>
));

HeadingField.displayName = "HeadingField";

const SubheadingField = memo(({ label, className }) => (
  <h2 className={cn("text-sm", className)}>{label}</h2>
));

SubheadingField.displayName = "SubheadingField";

const FormGenerate = ({
  form,
  formFields,
  submitText = "Submit",
  onFileChange,
  onSubmit,
  children,
  className,
  hiddenFields = [],
}) => {
  const { isSubmitting } = useFormState({ control: form?.control });

  const generateField = useMemo(() => {
    const fieldGenerators = {
      text: (field, formField) => (
        <Input
          className={formField?.className}
          placeholder={formField?.placeholder || ""}
          disabled={isSubmitting || formField?.disabled}
          {...field}
        />
      ),

      textarea: (field, formField) => (
        <Textarea
          placeholder={formField?.placeholder || ""}
          disabled={isSubmitting || formField?.disabled}
          {...field}
        />
      ),

      email: (field, formField) => (
        <Input
          type="email"
          className={formField?.className}
          placeholder={formField?.placeholder || ""}
          disabled={isSubmitting || formField?.disabled}
          {...field}
        />
      ),

      number: (field, formField) => (
        <Input
          type="number"
          placeholder={formField?.placeholder || ""}
          min={formField?.min}
          max={formField?.max}
          className={cn("no-spinner")}
          disabled={isSubmitting || formField?.disabled}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
            }
          }}
          {...field}
        />
      ),

      select: (field, formField) => (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full" disabled={isSubmitting}>
            <SelectValue placeholder={formField?.placeholder || ""} />
          </SelectTrigger>
          <SelectContent className="w-full">
            {formField.options?.map((option, i) => (
              <SelectItem key={i} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),

      date: (field, formField) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !field.value && "text-muted-foreground",
              )}
              disabled={isSubmitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(field.value, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
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
                if (formField?.pastDisable) return date < today;
                if (formField?.futureDisable) return date > today;
                return isSubmitting || false;
              }}
            />
          </PopoverContent>
        </Popover>
      ),

      file: (field, formField) => (
        <FileUploader
          value={field.value}
          onValueChange={(files) => {
            if (typeof onFileChange === "function") {
              onFileChange(files, field.onChange);
            } else {
              field.onChange(files);
            }
          }}
          dropzoneOptions={{
            ...formField?.dropZoneConfig,
            disabled: isSubmitting,
          }}
          reSelect={!isSubmitting}
          className={cn("bg-background relative rounded-lg p-2")}
        >
          <FileInput className="outline-1 outline-gray-400 outline-dashed">
            <div className="flex w-full flex-col items-center justify-center pt-3 pb-4">
              <FileSvgDraw
                allowedTypes={Object.values(
                  formField?.dropZoneConfig?.accept || {},
                )}
              />
            </div>
          </FileInput>
          {field.value?.length > 0 && (
            <FileUploaderContent>
              {field.value.map((file, i) => (
                <FileUploaderItem key={i} index={i} disabled={isSubmitting}>
                  <Paperclip className="h-4 w-4 stroke-current" />
                  <span>{file.name}</span>
                </FileUploaderItem>
              ))}
            </FileUploaderContent>
          )}
        </FileUploader>
      ),

      checkbox: (field, formField) => (
        <div className="flex items-center gap-1">
          <Checkbox
            checked={field.value || false}
            onCheckedChange={field.onChange}
            disabled={isSubmitting}
          />
          <div className="space-y-1 leading-none">{formField.placeholder}</div>
        </div>
      ),

      phone: (field) => (
        <PhoneInput
          {...field}
          defaultCountry="IN"
          autoComplete="tel"
          disabled={isSubmitting}
        />
      ),

      country_select: (field) => (
        <CountryDropdown
          placeholder="Country"
          defaultValue={field.value}
          onChange={(country) => {
            field.onChange(country.alpha3);
          }}
          disabled={isSubmitting}
        />
      ),

      user_select: (field) => (
        <UserSelect
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={isSubmitting}
        />
      ),

      tags_input: (field, formField) => (
        <TagsInput
          value={field.value || []}
          onChange={field.onChange}
          placeholder={formField?.placeholder || "Add item..."}
          separators={formField?.separators || [",", " ", ";", "Enter"]}
          maxTags={formField?.maxTags}
          minTags={formField?.minTags}
          validateTag={formField?.validateTag}
          disabled={isSubmitting}
          className={formField?.inputClassName}
        />
      ),
    };

    return (field, formField) => {
      const generator = fieldGenerators[formField.type];
      return generator ? generator(field, formField) : null;
    };
  }, [isSubmitting, onFileChange]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn("relative space-y-4", className)}>
        {formFields.map((formField, index) => {
          if (formField?.type === "hr") {
            return <hr key={index} className={cn(formField?.className)} />;
          }

          if (formField?.type === "heading") {
            return (
              <HeadingField
                key={index}
                label={formField.label}
                className={formField?.className}
              />
            );
          }

          if (formField?.type === "subheading") {
            return (
              <SubheadingField
                key={index}
                label={formField.label}
                className={formField?.className}
              />
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
                      {formField.label}
                      {formField.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                  )}
                  {formField?.description && (
                    <FormDescription>{formField.description}</FormDescription>
                  )}
                  <FormControl>{generateField(field, formField)}</FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        {children}
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

export default memo(FormGenerate);
