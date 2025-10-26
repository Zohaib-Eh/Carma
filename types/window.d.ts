interface StorageResult {
  key: string;
  value: string;
  shared: boolean;
}

interface StorageListResult {
  keys: string[];
  prefix?: string;
  shared: boolean;
}

interface PersistentStorage {
  get(key: string, shared?: boolean): Promise<StorageResult | null>;
  set(key: string, value: string, shared?: boolean): Promise<StorageResult | null>;
  delete(key: string, shared?: boolean): Promise<{ key: string; deleted: boolean; shared: boolean } | null>;
  list(prefix?: string, shared?: boolean): Promise<StorageListResult | null>;
}

declare global {
  interface Window {
    storage: PersistentStorage;
  }
}

export {};