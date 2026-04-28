export const typingSpeedTestToolSpec = {
  id: 'typing-speed-test',
  displayName: 'Typing Speed Test',
  execution: 'client-only',
  input: {
    types: ['keyboard-input'],
    maxChars: 5000
  },
  output: {
    types: ['wpm', 'cpm', 'accuracy', 'errors']
  },
  privacy: {
    userInputLeavesDevice: false,
    storesUserInput: false,
    analyticsIncludesRawInput: false
  },
  limits: {
    rateLimitPerMinute: 60,
    timeoutMs: 300000
  },
  analyticsEvents: ['tool_start', 'typing_test_completed', 'copy_action', 'share_action'],
  launchChecklist: [
    '60 second happy path tested',
    'WPM formula unit tested',
    'accuracy formula unit tested',
    'no raw typed text in analytics',
    'mobile keyboard tested'
  ]
} as const;
