import ts from 'typescript';

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
