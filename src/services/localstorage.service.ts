class LocalStorageService {
  private static _instance: LocalStorageService = new LocalStorageService();

  public static getInstance(): LocalStorageService {
    return this._instance;
  }

  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}

export const Store = LocalStorageService.getInstance();
