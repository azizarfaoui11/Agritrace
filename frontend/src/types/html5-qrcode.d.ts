declare module 'html5-qrcode' {
  export class Html5QrcodeScanner {
    constructor(
      elementId: string,
      config: {
        fps?: number;
        qrbox?: { width: number; height: number } | number;
        aspectRatio?: number;
        disableFlip?: boolean;
        formatsToSupport?: string[];
      },
      verbose?: boolean
    );

    render(
      successCallback: (decodedText: string, decodedResult?: any) => void,
      errorCallback: (errorMessage: string, error?: any) => void
    ): void;

    clear(): Promise<void>;
    
    stop(): Promise<void>;

    getState(): void;
  }

  export class Html5Qrcode {
    constructor(elementId: string);
  }
} 