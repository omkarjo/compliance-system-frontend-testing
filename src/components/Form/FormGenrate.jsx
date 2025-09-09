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
import { Link } from "react-router-dom";
import { CountryDropdown } from "../extension/country-dropdown";
import {
  AmountInput,
  AutocompleteInput,
  MultiSelectInput,
  PhoneInput,
  TagsInput,
} from "../Inputs";
import { EntitySelect, FundSelect, TaskSelect, UserSelect } from "../Select";

export const FileSvgDraw = memo(({ allowedTypes }) => (
  <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
    <div className="my-1 flex size-9 items-center justify-center rounded-md bg-muted">
      <Upload size={16} className="text-muted-foreground" />
    </div>
    <p className="my-0.5 mb-1 text-sm text-muted-foreground">
      Drag and drop your files here
    </p>
    {allowedTypes?.length > 0 && (
      <p className="text-xs text-muted-foreground">
        Allowed file types: {allowedTypes.join(", ")}
      </p>
    )}
  </div>
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
  disabledFields = [],
  specialProps = [],
  submitButtonClassName,
  onCancel,
}) => {
  const { isSubmitting } = useFormState({ control: form?.control });

  const generateField = useMemo(() => {
    const fieldGenerators = {
      text: (field, formField) => (
        <Input
          className={cn(formField?.className)}
          placeholder={formField?.placeholder || ""}
          disabled={
            isSubmitting ||
            formField?.disabled ||
            disabledFields?.includes(field.name)
          }
          {...field}
        />
      ),

      autocomplete: (field, formField) => (
        <AutocompleteInput
          className={cn(formField?.className)}
          placeholder={formField?.placeholder || ""}
          disabled={
            isSubmitting ||
            formField?.disabled ||
            disabledFields?.includes(field.name)
          }
          suggestions={formField?.suggestions || []}
          {...field}
        />
      ),
      textarea: (field, formField) => (
        <Textarea
          className={cn(formField?.className)}
          placeholder={formField?.placeholder || ""}
          disabled={
            isSubmitting ||
            formField?.disabled ||
            disabledFields?.includes(field.name)
          }
          {...field}
        />
      ),
      email: (field, formField) => (
        <Input
          type="email"
          className={cn(formField?.className)}
          placeholder={formField?.placeholder || ""}
          disabled={
            isSubmitting ||
            formField?.disabled ||
            disabledFields?.includes(field.name)
          }
          {...field}
        />
      ),
      number: (field, formField) => (
        <Input
          type="number"
          placeholder={formField?.placeholder || ""}
          min={formField?.min}
          max={formField?.max}
          className={cn(
            "no-spinners",
            formField?.className,
          )}
          disabled={
            isSubmitting ||
            formField?.disabled ||
            disabledFields?.includes(field.name)
          }
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
            }
          }}
          {...field}
        />
      ),
      amount: (field, formField, isSubmitting, disabledFields = []) => (
        <AmountInput
          placeholder={formField?.placeholder || ""}
          min={formField?.min}
          max={formField?.max}
          className={cn(
            "no-spinners",
            formField?.className,
          )}
          disabled={
            isSubmitting ||
            formField?.disabled ||
            disabledFields?.includes(field.name)
          }
          {...field}
        />
      ),
      select: (field, formField) => (
        <Select
          name={field.name}
          onValueChange={field.onChange}
          value={field.value}
          disabled={
            isSubmitting ||
            formField?.disabled ||
            disabledFields?.includes(field.name)
          }
        >
          <SelectTrigger className="w-full">
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
      multiSelect: (field, formField, specialProp) => (
        <MultiSelectInput
          field={field}
          formField={formField}
          isSubmitting={isSubmitting}
          disabledFields={disabledFields}
          specialProps={specialProp}
        />
      ),
      date: (field, formField) => {
        const selectedDate =
          field.value instanceof Date
            ? field.value
            : field.value
              ? new Date(field.value)
              : null;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                data-testid={formField.name}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-transparent hover:bg-accent hover:text-accent-foreground dark:bg-transparent",
                  !selectedDate && "text-muted-foreground",
                )}
                disabled={isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>{formField?.placeholder || "Pick a date"}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => field.onChange(date)}
                initialFocus
                captionLayout="dropdown"
                disabled={(date) => {
                  const today = new Date();
                  if (formField?.pastDisable) return date < today;
                  if (formField?.futureDisable) return date > today;
                  return false;
                }}
              />
            </PopoverContent>
          </Popover>
        );
      },

      file: (field, formField) => (
        <FileUploader
          data-testid={formField.name}
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
            disabled:
              isSubmitting ||
              formField?.disabled ||
              disabledFields?.includes(field.name),
          }}
          reSelect={!isSubmitting}
          className={cn("bg-background relative rounded-lg p-2")}
        >
          <FileInput className="outline-2 outline-gray-400 outline-dashed">
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
              {field.value.map((file, i) => {
                if (file instanceof File) {
                  return (
                    <FileUploaderItem key={i} index={i} disabled={isSubmitting}>
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  );
                } else if (typeof file === "object") {
                  return (
                    <Link
                      to={file.url}
                      key={i}
                      target="_blank"
                      className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-2 py-1 text-sm"
                    >
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </Link>
                  );
                } else {
                  return null;
                }
              })}
            </FileUploaderContent>
          )}
        </FileUploader>
      ),
      checkbox: (field, formField) => (
        <div className="flex items-center gap-3">
          <Checkbox
            id={field.name}
            name={field.name}
            checked={field.value || false}
            onCheckedChange={field.onChange}
            disabled={
              isSubmitting ||
              formField?.disabled ||
              disabledFields?.includes(field.name)
            }
          />
          <label
            htmlFor={field.name}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {formField.placeholder}
          </label>
        </div>
      ),
      phone: (field) => (
        <PhoneInput
          {...field}
          defaultCountry="IN"
          autoComplete="tel"
          disabled={
            isSubmitting ||
            field?.disabled ||
            disabledFields?.includes(field.name)
          }
        />
      ),
      country_select: (field) => (
        <CountryDropdown
          name={field.name}
          placeholder="Country"
          defaultValue={field.value}
          onChange={(country) => field.onChange(country.alpha3)}
          disabled={
            isSubmitting ||
            field?.disabled ||
            disabledFields?.includes(field.name)
          }
        />
      ),
      user_select: (field, formField) => (
        <UserSelect
          name={field.name}
          onValueChange={field.onChange}
          defaultValue={field.value}
          buttonText={formField?.placeholder || "Select User"}
          disabled={
            isSubmitting ||
            field?.disabled ||
            disabledFields?.includes(field.name)
          }
        />
      ),
      task_select: (field, formField, specialProp) => (
        <TaskSelect
          name={field.name}
          onValueChange={field.onChange}
          defaultValue={field.value}
          className=""
          disabled={
            isSubmitting ||
            field?.disabled ||
            disabledFields?.includes(field.name)
          }
          {...specialProp}
        />
      ),
      tags_input: (field, formField, specialProp) => (
        <TagsInput
          value={field.value || []}
          onChange={field.onChange}
          placeholder={formField?.placeholder || "Add item..."}
          separators={formField?.separators || [",", " ", ";", "Enter"]}
          maxTags={formField?.maxTags}
          minTags={formField?.minTags}
          validateTag={formField?.validateTag}
          disabled={
            isSubmitting ||
            field?.disabled ||
            disabledFields?.includes(field.name)
          }
          className={formField?.inputClassName}
          {...specialProp}
        />
      ),

      entity_select: (field, formField, specialProp) => (
        <EntitySelect
          defaultValue={field.value}
          onValueChange={field.onChange}
          className={cn("w-full", formField?.className)}
          isFilter={formField?.isFilter || false}
          buttonText={formField?.placeholder || "Select Entity"}
          returnFullObject={formField?.returnFullObject || false}
          id={formField?.id || ""}
          {...specialProp}
        />
      ),

      fund_select: (field, formField, specialProp) => (
        <FundSelect
          defaultValue={field.value}
          onValueChange={field.onChange}
          className={cn("w-full", formField?.className)}
          isFilter={formField?.isFilter || false}
          buttonText={formField?.placeholder || "Select Fund"}
          returnFullObject={formField?.returnFullObject || false}
          id={formField?.id || ""}
          {...specialProp}
        />
      ),
    };

    return (field, formField, specialProp = {}) => {
      const generator = fieldGenerators[formField.type];
      return generator ? generator(field, formField, specialProp) : null;
    };
  }, [isSubmitting, onFileChange, disabledFields]);

  console.log("Error in FormGenerate:", form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn("relative space-y-4", className)}>
        {formFields.map((formField, index) => {
          if (
            formField?.type === "hr" &&
            formField?.name &&
            !hiddenFields.includes(formField.name)
          ) {
            return <hr key={index} className={cn(formField?.className)} />;
          } else if (
            formField?.type === "heading" &&
            formField?.label &&
            !hiddenFields.includes(formField.name)
          ) {
            return (
              <HeadingField
                key={index}
                label={formField.label}
                className={formField?.className}
              />
            );
          } else if (
            (formField?.type === "subheading" ||
              formField?.type === "subtitle") &&
            !hiddenFields.includes(formField?.name)
          ) {
            return (
              <SubheadingField
                key={index}
                label={formField.label}
                className={formField?.className}
              />
            );
          } else {
            return (
              <FormField
                key={index}
                name={formField.name}
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "",
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
                    <FormControl>
                      {generateField(
                        field,
                        formField,
                        specialProps.find((sp) => sp.name === formField.name)
                          ?.props || {},
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }
        })}
        {children}

        {onCancel && (
          <Button
            type="button"
            variant="destructive"
            className={cn(
              "w-full cursor-pointer transition-transform duration-150 active:scale-95",
              submitButtonClassName,
            )}
            data-testid="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full cursor-pointer transition-transform duration-150 active:scale-95",
            submitButtonClassName,
          )}
          data-testid="submit-button"
        >
          {isSubmitting ? "Submitting..." : submitText}
        </Button>
      </form>
    </Form>
  );
};

export default memo(FormGenerate);
