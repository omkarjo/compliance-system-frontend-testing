import React, { useState, KeyboardEvent, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TagItem = React.memo(
  ({ tag, index, onRemove, disabled = false }) => {
    return (
        <button
          key={`${tag}-${index}`}
          className={cn("", disabled && "cursor-not-allowed")}
          onClick={() => !disabled && onRemove(tag)}
          type="button"
        >
          <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1 px-3 py-1">
            {tag}
            {!disabled && (
              <X
                size={14}
                className="cursor-pointer hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(tag);
                }}
              />
            )}
          </Badge>
        </button>
    );
  }
);

TagItem.displayName = "TagItem";

export const TagsInput = React.forwardRef(
  ({
    value = [],
    onChange,
    placeholder = "Add item...",
    disabled = false,
    separators = [',', ' ', ';', 'Enter'],
    className,
    maxTags,
    minTags,
    validateTag = (tag) => tag.trim().length > 0,
  }, ref) => {
    const [inputValue, setInputValue] = useState('');
    const [validationError, setValidationError] = useState('');
    const inputRef = useRef(null);

    const addTag = (tag) => {
      const trimmedTag = tag.trim();
      
      setValidationError('');
      
      if (!trimmedTag) return;
      
      if (!validateTag(trimmedTag)) {
        setValidationError("Invalid tag format");
        return;
      }
      
      if (maxTags && value.length >= maxTags) {
        setValidationError(`Maximum of ${maxTags} tags allowed`);
        return;
      }
      
      if (value.includes(trimmedTag)) {
        setValidationError(`"${trimmedTag}" already exists`);
        return;
      }
      
      onChange([...value, trimmedTag]);
      setInputValue('');
    };

    const removeTag = (tagToRemove) => {
      if (minTags && value.length <= minTags) {
        setValidationError(`Minimum of ${minTags} tags required`);
        return;
      }
      
      const newValue = value.filter(tag => tag !== tagToRemove);
      onChange(newValue);
      setValidationError('');
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        removeTag(value[value.length - 1]);
      } else if (separators.includes(e.key)) {
        e.preventDefault();
        addTag(inputValue);
      }
    };

    const handleInputChange = (e) => {
      const newValue = e.target.value;
      const lastChar = newValue.slice(-1);
      
      if (validationError) {
        setValidationError('');
      }
      
      if (separators.includes(lastChar) && lastChar !== 'Enter') {
        const tagToAdd = newValue.slice(0, -1);
        if (tagToAdd.trim()) {
          addTag(tagToAdd);
        } else {
          setInputValue('');
        }
      } else {
        setInputValue(newValue);
      }
    };

    const handleAddButtonClick = () => {
      if (inputValue) {
        addTag(inputValue);
      }
      inputRef.current?.focus();
    };
    
    const isMaxed = maxTags !== undefined && value.length >= maxTags;
    const isBelowMin = minTags !== undefined && value.length < minTags;

    return (
      <div className={cn("space-y-3", className)}>
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 py-2">
            {value.map((tag, index) => (
              <TagItem 
                key={index} 
                tag={tag} 
                index={index} 
                onRemove={removeTag} 
                disabled={disabled || (minTags !== undefined && value.length <= minTags)} 
              />
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isMaxed}
            className={cn("flex-grow", validationError && "border-destructive focus-visible:ring-destructive")}
          />
          <Button 
            type="button" 
            size="sm" 
            onClick={handleAddButtonClick}
            disabled={disabled || !inputValue || isMaxed}
          >
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
        
        {validationError && (
          <div className="text-sm font-medium text-destructive">
            {validationError}
          </div>
        )}
        
        {(minTags !== undefined || maxTags !== undefined) && (
          <div className={cn(
            "text-xs text-right",
            isBelowMin ? "text-destructive font-medium" : "text-muted-foreground"
          )}>
            {value.length} 
            {minTags !== undefined && maxTags !== undefined ? ` / ${minTags}-${maxTags}` : 
             minTags !== undefined ? ` / min ${minTags}` : 
             ` / max ${maxTags}`}
          </div>
        )}
      </div>
    );
  }
);

TagsInput.displayName = "TagsInput";

export const tagsInputFieldGenerator = (field, formField) => (
  <TagsInput
    value={field.value || []}
    onChange={(newValue) => {
      field.onChange(newValue);
      
      if (formField?.minTags !== undefined && newValue.length < formField.minTags) {
        if (field.name && typeof field.setError === 'function') {
          field.setError(`Minimum of ${formField.minTags} tags required`);
        }
      } else if (field.error && typeof field.clearErrors === 'function') {
        field.clearErrors();
      }
    }}
    placeholder={formField?.placeholder || "Add item..."}
    separators={formField?.separators || [',', ' ', ';', 'Enter']}
    maxTags={formField?.maxTags}
    minTags={formField?.minTags}
    validateTag={(tag) => {
      const isValid = formField?.validateTag ? formField.validateTag(tag) : tag.trim().length > 0;
      
      if (!isValid && field.name && typeof field.setError === 'function') {
        field.setError(`Invalid tag format: ${tag}`);
      }
      
      return isValid;
    }}
    disabled={formField?.disabled}
    className={formField?.inputClassName}
  />
);