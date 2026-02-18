"use client";

import { useState, useEffect } from "react";

export function useCountries(withMakes: boolean) {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/countries?withMakes=${withMakes}`)
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.countries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [withMakes]);

  return { countries, loading };
}
