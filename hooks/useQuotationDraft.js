// hooks/useQuotationDraft.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { saveQuotationDraft, loadQuotationDraft } from '@/storage/quotationDrafts';

function useDebounced(fn, delay = 700) {
  const t = useRef(null);
  const fnRef = useRef(fn);
  
  // Update the ref when fn changes
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  
  return useCallback((...args) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => fnRef.current(...args), delay);
  }, [delay]);
}

/**
 * Handles RHF initialization + async draft load + debounced autosave
 */
export function useQuotationDraft(
  tripId,
  defaults,
) {
  const [loading, setLoading] = useState(true);
  const methods = useForm({ defaultValues: defaults, mode: 'onChange' });

  useEffect(() => {
    (async () => {
      const saved = tripId ? await loadQuotationDraft(tripId) : null;
      if (saved) methods.reset({ ...(defaults), ...(saved) });
      setLoading(false);
    })();
  }, [tripId]);

  const saveValues = useCallback((values) => {
    if (tripId) saveQuotationDraft(tripId, values);
  }, [tripId]);

  const debounced = useDebounced(saveValues, 700);

  useEffect(() => {
    const sub = methods.watch((vals) => debounced(vals));
    return () => sub.unsubscribe();
  }, [methods.watch, debounced]);

  return { methods, loading };
}
