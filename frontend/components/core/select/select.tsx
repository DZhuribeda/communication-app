import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import classNames from "classnames";

type SelectItem = {
  label: string;
};

type SelectProps = {
  label: string;
  options: SelectItem[];
  selected: SelectItem;
  setSelected: (selected: SelectItem) => void;
  error?: string;
};

export function Select({
  label,
  options,
  selected,
  setSelected,
  error,
}: SelectProps) {
  return (
    <div className="w-72">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Label className="text-sm font-normal text-gray-700 mb-1">
            {label}
          </Listbox.Label>
          <Listbox.Button
            className={classNames(
              "relative w-full py-2 pl-3 pr-10 text-left text-md font-normal text-gray-900 bg-white rounded-lg shadow-xs cursor-default border focus:outline-none",
              {
                "border-gray-300 focus:border-primary-300 focus:shadow-focus ":
                  !error,
                "border-error-300 focus:shadow-error-100": error,
              }
            )}
          >
            <span className="block truncate">{selected.label}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-500"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-sm font-normal bg-white rounded-md shadow-xs max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `${active ? "bg-primary-50" : ""}
                    text-gray-900 cursor-default select-none relative py-2 px-2`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? "font-medium" : "font-normal"
                        } block truncate`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={`text-primary-600 absolute inset-y-0 right-0 flex items-center px-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error ? (
        <span role="alert" className="pt-1 text-error-500 text-sm">
          {error}
        </span>
      ) : null}
    </div>
  );
}
