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
    for (let i = 0, len = messageChain.length; i < len; i++) {
      const message = messageChain[i];
      result.push(message);
      const results = messageChainToArray(message.next);
      for (let k = 0, klen = results.length; k < klen; k++) {
        result.push(results[k]);
      }
    }
  }

  return result;
}
