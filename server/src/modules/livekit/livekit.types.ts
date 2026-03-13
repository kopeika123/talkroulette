export interface LivekitConfig {
  apiKey: string;
  apiSecret: string;
  serverUrl: string;
}

export interface LivekitConfigProvider {
  getConfig(): LivekitConfig | null;
}

export interface CreateLivekitTokenInput {
  identity?: string;
  name?: string;
  roomName?: string;
}
