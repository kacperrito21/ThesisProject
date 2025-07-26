'use client';

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { LanguageIcon } from '@heroicons/react/16/solid';

const languages = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'pl', label: '🇵🇱 Polski' },
];

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function LanguageSwitch({ value, onChange }: Props) {
  const selected = languages.find((lang) => lang.value === value) ?? languages[0];

  return (
    <Listbox value={selected} onChange={(lang) => onChange(lang.value)}>
      <div className="relative w-full max-w-sm">
        <ListboxButton className="flex items-center bg-white border border-[var(--color-chosen)] rounded-xl px-4 py-2 shadow-sm w-full text-sm">
          <LanguageIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
          {selected.label}
        </ListboxButton>

        <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-md text-sm">
          {languages.map((lang) => (
            <ListboxOption
              key={lang.value}
              value={lang}
              className={({ focus, selected }) =>
                `cursor-pointer px-4 py-2 ${
                  focus ? 'bg-gray-100 rounded-xl' : ''
                } ${selected ? 'font-medium text-[var(--color-chosen)]' : ''}`
              }
            >
              {lang.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
