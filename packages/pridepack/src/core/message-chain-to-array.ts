import type ts from 'typescript';

interface DiagnosticMessageSimple {
  messageText: string;
  code: number;
  category: ts.DiagnosticCategory;
}

export default function messageChainToArray(
  messageChain?: ts.DiagnosticMessageChain[],
): DiagnosticMessageSimple[] {
  const result: DiagnosticMessageSimple[] = [];

  if (messageChain) {
    for (const message of messageChain) {
      result.push(message);
      const results = messageChainToArray(message.next);
      for (const innerMessage of results) {
        result.push(innerMessage);
      }
    }
  }

  return result;
}
