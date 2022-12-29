declare module 'bops' {
  export function from(str: string, encoding: string): Buffer;
  export function to(buf: Buffer, encoding: string): string;
}