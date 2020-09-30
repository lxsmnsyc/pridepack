import { DiagnosticCategory, DiagnosticMessageChain } from 'typescript';

interface DiagnosticMessageSimple {
  messageText: string;
  code: number;
  category: DiagnosticCategory;
}

export default function messageChainToArray(
  messageChain?: DiagnosticMessageChain[],
): DiagnosticMessageSimple[] {
  const result: DiagnosticMessageSimple[] = [];

  if (messageChain) {
    messageChain.forEach((message) => {
      result.push(message);
      const results = messageChainToArray(message.next);
      results.forEach((innerMessage) => {
        result.push(innerMessage);
      });
    });
  }

  return result;
}
