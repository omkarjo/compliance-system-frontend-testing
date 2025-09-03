import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

const PhoneInput = React.forwardRef((props, ref) => {
  const { className, onChange, ...restProps } = props;

  return (
    <RPNInput.default
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      onChange={(value) => onChange?.(value || "")}
      {...restProps}
    />
  );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;
  return (
    <Input
      className={cn(
        "rounded-s-none rounded-e-lg focus-visible:ring-0",
        className,
      )}
      {...restProps}
      ref={ref}
    />
  );
});
InputComponent.displayName = "InputComponent";

const CountrySelect = (props) => {
  const {
    disabled,
    value: selectedCountry = "IN",
    options: countryList,
    onChange,
  } = props;
  const [open, setOpen] = React.useState(false);
  const scrollAreaRef = React.useRef(null);

  const handleScroll = React.useCallback((event) => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollArea;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;

    // Prevent event propagation when scrolling is possible
    if ((event.deltaY > 0 && !isAtBottom) || (event.deltaY < 0 && !isAtTop)) {
      event.stopPropagation();
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-1 rounded-s-lg rounded-e-none border-r-0 px-3 focus:z-10"
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "-mr-2 size-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-[300px] w-[300px] overflow-auto p-0"
        align="start"
        side="bottom"
        sideOffset={5}
      >
        <Command>
          <CommandInput className="" placeholder="Search country..." />
          <CommandList>
            <div
              ref={scrollAreaRef}
              className="max-h-[250px] overflow-y-auto"
              onWheel={handleScroll}
            >
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={() => {
                        onChange(value);
                        setOpen(false);
                      }}
                      className="gap-2"
                    >
                      <FlagComponent country={value} countryName={label} />
                      <span className="flex-1 text-sm">{label}</span>
                      <span className="text-foreground/50 text-sm">
                        {`+${RPNInput.getCountryCallingCode(value)}`}
                      </span>
                      <CheckIcon
                        className={`ml-auto size-4 ${value === selectedCountry ? "opacity-100" : "opacity-0"}`}
                      />
                    </CommandItem>
                  ) : null,
                )}
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }) => {
  const Flag = flags[country];

  return (
    <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-sm [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export default PhoneInput;
