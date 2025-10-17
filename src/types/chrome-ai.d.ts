/**
 * Chrome AI API type augmentations
 * These extend the Chrome types with the Built-in AI APIs
 */

declare namespace chrome.ai {
  interface Summarizer {
    summarize(text: string, options?: { maxLength?: number }): Promise<string>
    available(): Promise<boolean>
  }

  interface Prompter {
    embed(text: string): Promise<Float32Array>
    prompt(text: string, options?: { temperature?: number }): Promise<string>
    available(): Promise<boolean>
  }

  interface Writer {
    write(prompt: string, options?: { tone?: string; length?: string }): Promise<string>
    available(): Promise<boolean>
  }

  interface Translator {
    translate(
      text: string,
      options: { sourceLanguage?: string; targetLanguage: string }
    ): Promise<string>
    available(): Promise<boolean>
  }

  interface Proofreader {
    proofread(text: string): Promise<string>
    available(): Promise<boolean>
  }

  interface Rewriter {
    rewrite(
      text: string,
      options?: { tone?: string; length?: string; format?: string }
    ): Promise<string>
    available(): Promise<boolean>
  }

  const summarizer: Summarizer
  const prompt: Prompter
  const writer: Writer
  const translator: Translator
  const proofreader: Proofreader
  const rewriter: Rewriter
}
