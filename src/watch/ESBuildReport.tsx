import React from 'react';
import { DiagnosticCategory } from 'typescript';
import DiagnosticMessage from './DiagnosticMessage';


export interface ESBuildReportProps {
  report?: string;
}

export default function ESBuildReport({ report }: ESBuildReportProps) {
  if (report) {
    return (
      <DiagnosticMessage
        category={DiagnosticCategory.Error}
        message={report}
      />
    );
  }
  return (
    <DiagnosticMessage
      category={DiagnosticCategory.Message}
      message="Build success."
    />
  );
}