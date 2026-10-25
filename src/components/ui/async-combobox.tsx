"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Combobox, type ComboboxOption, type ComboboxProps } from "./combobox.js";

export type AsyncComboboxProps = Omit<ComboboxProps, "options" | "onQueryChange" | "loading" | "errorText"> & {
  fetcher: (query: string, signal: AbortSignal) => Promise<ComboboxOption[]>;
  debounceMs?: number;
  initialOptions?: ComboboxOption[];
  selectedOption?: ComboboxOption | null;
  loadingLabel?: string;
  errorText?: string;
  allowCreate?: boolean;
  createLabel?: (query: string) => string;
};

const optionKey = (option: ComboboxOption) => option.value;
const EMPTY_OPTIONS: ComboboxOption[] = [];

export function AsyncCombobox({
  fetcher,
  debounceMs = 250,
  initialOptions = EMPTY_OPTIONS,
  selectedOption,
  loadingLabel,
  errorText,
  allowCreate = false,
  createLabel,
  ...props
}: AsyncComboboxProps) {
  const [options, setOptions] = useState<ComboboxOption[]>(initialOptions);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | undefined>();
  const [query, setQuery] = useState("");
  const knownOptions = useRef(new Map(initialOptions.map((option) => [optionKey(option), option])));
  const controller = useRef<AbortController | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    for (const option of initialOptions) knownOptions.current.set(optionKey(option), option);
    if (selectedOption) knownOptions.current.set(optionKey(selectedOption), selectedOption);
    setOptions((current) => {
      const merged = new Map(current.map((option) => [optionKey(option), option]));
      for (const option of initialOptions) merged.set(optionKey(option), option);
      if (selectedOption) merged.set(optionKey(selectedOption), selectedOption);
      const next = [...merged.values()];
      return next.length === current.length && next.every((option, index) => option.value === current[index]?.value && option.label === current[index]?.label) ? current : next;
    });
  }, [initialOptions, selectedOption]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    controller.current?.abort();
  }, []);

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    setFetchError(undefined);
    if (timer.current) clearTimeout(timer.current);
    controller.current?.abort();
    if (!nextQuery.trim()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const nextController = new AbortController();
    controller.current = nextController;
    timer.current = setTimeout(() => {
      void fetcher(nextQuery, nextController.signal)
        .then((result) => {
          if (nextController.signal.aborted) return;
          for (const option of result) knownOptions.current.set(optionKey(option), option);
          setOptions(result);
          setLoading(false);
        })
        .catch((error: unknown) => {
          if (nextController.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) return;
          setFetchError(errorText ?? "Unable to load options");
          setLoading(false);
        });
    }, debounceMs);
  };

  const selectedValue = props.value !== undefined ? props.value : props.defaultValue;
  const visibleOptions = useMemo(() => {
    const merged = new Map(options.map((option) => [optionKey(option), option]));
    if (selectedOption) merged.set(optionKey(selectedOption), selectedOption);
    if (selectedValue) {
      const known = knownOptions.current.get(selectedValue);
      if (known) merged.set(optionKey(known), known);
    }
    if (allowCreate && query.trim() && !loading && !fetchError && ![...merged.values()].some((option) => option.value === query || option.label.toLocaleLowerCase() === query.toLocaleLowerCase())) {
      merged.set(query, { value: query, label: createLabel?.(query) ?? `Create “${query}”` });
    }
    return [...merged.values()];
  }, [allowCreate, createLabel, fetchError, loading, options, query, selectedOption, selectedValue]);

  return <Combobox {...props} options={visibleOptions} onQueryChange={handleQueryChange} loading={loading} loadingLabel={loadingLabel} errorText={fetchError} />;
}
