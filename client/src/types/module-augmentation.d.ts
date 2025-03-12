declare module '@client/types' {
  export * from './assessment.types';
}

declare module '@client/*' {
  const content: any;
  export = content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'virtual:*' {
  const content: any;
  export default content;
} 