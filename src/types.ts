export interface Rules {
  'prettier/prettier': [string, {[key: string]: string | boolean | number}];
}

export interface EslintConfig {
  extends: string[];
  plugins?: string[];
  rules?: Rules;
}