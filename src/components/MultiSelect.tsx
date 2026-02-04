import {
  CaretSortIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import React from 'react';
import Select, { StylesConfig, components } from 'react-select';

// Define the type for the option
interface OptionType {
  label: string;
  value: string;
}

// Define the type for the props
interface MultiSelectProps {
  options: OptionType[];
  value?: any[];
  onChange?: (values: string[]) => void;
  isMulti?: boolean;
  [key: string]: any; // To allow passing other props
}

// Define custom styles with type annotations
const customStyles: StylesConfig<OptionType, true> = {
  // Styles the main control element (the input box and dropdown toggle)
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent', // Sets the background of the control to be transparent
    borderColor: state.hasValue
      ? 'hsl(var(--foreground))' // Border color when an item is selected
      : 'hsl(var(--border))', // Default border color
    borderRadius: '0.375rem', // Applies a small border radius to make the corners rounded
    boxShadow: 'none', // Removes any default box shadow
    transition: 'border-color 0.2s ease', // Adds a smooth transition effect for the border color
    '&:hover': {
      // borderColor: 'hsl(var(--border))',  // On hover, maintain the default border color
    },
  }),

  // Styles for the selected items (tags) in multi-select mode
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'hsl(var(--muted))', // Sets the background color of each selected tag to muted color
    borderRadius: '0.375rem', // Rounds the corners of the tags
    padding: '0 0.5rem', // Adds horizontal padding inside the tags
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'hsl(var(--foreground))', // Placeholder text color
  }),
  // Styles for the text label inside each selected tag
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'hsl(var(--foreground))', // Sets the text color to the foreground color
    backgroundColor: 'hsl(var(--muted))', // Uses the muted color for the tag background
  }),

  // Styles for each dropdown option
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'hsl(var(--card))' // If the option is selected, use the card background color
      : 'transparent', // If not selected, keep the background transparent
    color: 'hsl(var(--foreground))', // Sets the text color to the foreground color, regardless of selection
    padding: '0.5rem 1rem', // Adds padding to the option to make it more clickable
    borderRadius: '0.375rem', // Rounds the corners of each option
    '&:hover': {
      backgroundColor: state.isSelected
        ? 'hsl(var(--card))' // If hovered and selected, keep the card color
        : 'hsl(var(--muted))', // If hovered and not selected, use the muted color
      color: 'hsl(var(--foreground))', // Text color stays as the foreground color
    },
  }),

  // Styles the dropdown menu container
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'hsl(var(--background))', // Sets the background color for the entire menu to the system's background color
    borderRadius: '0.375rem', // Rounds the corners of the dropdown menu
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', // Adds a shadow to the menu for a slight elevation effect
    border: '1px solid hsl(var(--border))', // Adds a border with the system's border color
  }),

  // Styles the list inside the dropdown menu
  menuList: (provided) => ({
    ...provided,
    padding: '0.25rem 0', // Adds vertical padding around the list of options
  }),
};

// Custom dropdown indicator
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretSortIcon />

      {/* Custom arrow */}
    </components.DropdownIndicator>
  );
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange = () => {},
  isMulti = true,
  ...props
}) => {
  console.log({ value, options });

  return (
    <Select
      components={{ DropdownIndicator }} // Override the default dropdown indicator
      placeholder={'Select an option'}
      isMulti
      options={options}
      value={
        value?.map((val) => ({
          label:
            options?.find((el) => el.value === (val?.id ?? val))?.label ??
            val?.id ??
            val,
          value: val?.id ?? val,
        })) || []
      }
      onChange={(selectedOptions) => {
        onChange(selectedOptions.map((option) => option.value));
      }}
      className={'basic-multi-select'}
      classNamePrefix={'select'}
      styles={customStyles}
      {...props}
    />
  );
};

export default MultiSelect;
