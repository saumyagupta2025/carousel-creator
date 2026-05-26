export const SLIDE_TYPES = [
  { value: 'cover', label: 'Cover' },
  { value: 'text', label: 'Text' },
  { value: 'list', label: 'List' },
  { value: 'code', label: 'Code Snippet' },
  { value: 'longtext', label: 'Long Text' },
  { value: 'screenshot', label: 'Screenshot' },
];

export const CODE_LANGUAGES = [
  'javascript', 'typescript', 'python', 'jsx', 'tsx',
  'css', 'html', 'bash', 'json', 'rust', 'go', 'sql',
];

export const BULLETS_ICONS = ['①', '②', '③', '④', '⑤'];

export function createSlide(type = 'cover') {
  const defaults = {
    cover: {
      heading: 'Your Main Heading',
      subtitle: 'A compelling subtitle goes right here',
      tag: 'Topic Label',
      body: '',
      bullets: [],
      code: '',
      language: 'javascript',
      imageUrl: null,
      caption: '',
    },
    text: {
      heading: 'Slide Heading',
      subtitle: '',
      tag: 'Tag',
      body: 'Your body text goes here. Write something insightful and engaging for your audience.',
      bullets: [],
      code: '',
      language: 'javascript',
      imageUrl: null,
      caption: '',
    },
    list: {
      heading: 'Key Points',
      subtitle: '',
      tag: 'List',
      body: '',
      bullets: ['First important point', 'Second important point', 'Third important point'],
      code: '',
      language: 'javascript',
      imageUrl: null,
      caption: '',
    },
    code: {
      heading: 'Code Example',
      subtitle: '',
      tag: 'Code',
      body: '',
      bullets: [],
      code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
      language: 'javascript',
      imageUrl: null,
      caption: '',
    },
    longtext: {
      heading: 'Deep Dive',
      subtitle: '',
      tag: 'Explanation',
      body: 'Use this layout for longer technical explanations, detailed breakdowns, or any concept that needs more room to breathe. Write clearly and let the content do the heavy lifting.',
      bullets: [],
      code: '',
      language: 'javascript',
      imageUrl: null,
      caption: '',
    },
    screenshot: {
      heading: '',
      subtitle: '',
      tag: '',
      body: '',
      bullets: [],
      code: '',
      language: 'javascript',
      imageUrl: null,
      textAbove: '',
      caption: 'Caption text goes here',
    },
  };

  return {
    id: crypto.randomUUID(),
    type,
    ...defaults[type],
  };
}
