declare const KIT: {
  version: string;
  system: {
    revision: number;
    status: string;
    space: Record<string, number>;
    radius: Record<string, number>;
    size: Record<string, number>;
    typography: Record<string, {size: number; lineHeight: number; weight: string}>;
    layout: Record<string, {width: number; columns: number; margin: number; gutter: number}>;
    components: Record<string, {purpose: string; anatomy: string; rules: string; accessibility: string; responsive: string; code: string}>;
  };
  tokens: {
    colors: Record<string, string>;
    themes: Record<string, Record<string, string>>;
    proposedWebDefaults: Record<string, string>;
  };
};
