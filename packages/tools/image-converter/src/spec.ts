export const imageConverterToolSpec = {
  id: 'convert-image-to-png',
  displayName: 'Convert Image to PNG',
  execution: 'client-only',
  input: {
    types: ['image/png', 'image/jpeg', 'image/webp'],
    maxFileMb: 10
  },
  output: {
    types: ['image/png']
  },
  privacy: {
    userInputLeavesDevice: false,
    storesUploadedFiles: false,
    analyticsIncludesRawInput: false
  },
  limits: {
    rateLimitPerMinute: 30,
    timeoutMs: 120000
  },
  analyticsEvents: ['file_selected', 'tool_start', 'tool_complete', 'file_downloaded', 'tool_error'],
  launchChecklist: [
    'PNG/JPG/WebP happy path tested',
    'max file size tested',
    'no upload by default',
    'download button separated from ads'
  ]
} as const;
