'use client';
import { useEffect } from 'react';

export default function GovukBodyClass() {
  useEffect(() => {
    document.documentElement.classList.add('govuk-template');
    document.body.classList.add('govuk-template__body', 'govuk-frontend-supported');
    return () => {
      document.documentElement.classList.remove('govuk-template');
      document.body.classList.remove('govuk-template__body', 'govuk-frontend-supported');
    };
  }, []);
  return null;
}
