import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormControl } from "./ui/form";
import { ControllerRenderProps } from "react-hook-form";

interface SelectProps {
  label: string;
  options: any[];
  field: ControllerRenderProps<any, any>;
}

function SelectFormCtrl({ 
  label, 
  options, 
  field 
}: SelectProps) {
  const currentValue = field.value || "";
  
  // Ensure the value matches one of the available options
  const validValue = options?.some((opt) => opt.id === currentValue) 
    ? currentValue 
    : "";
  
  return (
    <>
      <Select
        onValueChange={(value) => {
          field.onChange(value);
        }}
        value={validValue}
        name={field.name}
      >
        <FormControl>
          <SelectTrigger aria-label={`Select ${label}`} className="w-[200px]">
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            {options && options.length > 0 ? (
              options.map((option) => {
                return (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className="capitalize"
                  >
                    {option.label ?? option.value ?? option.title}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value="no-options" disabled>
                No options available
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

export default SelectFormCtrl;
