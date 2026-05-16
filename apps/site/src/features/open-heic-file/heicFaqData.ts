export type HeicFaqItem = {
  question: string;
  answer: string;
};

export type HeicFaqGroup = {
  id: string;
  title: string;
  description: string;
  items: HeicFaqItem[];
};

export const heicViewerFaqs: HeicFaqItem[] = [
  {
    question: 'What is a HEIC file?',
    answer: 'HEIC is an image format commonly used by Apple devices for photos. It can keep good image quality with smaller file sizes, but some apps still do not support it.'
  },
  {
    question: 'Can I use this as a HEIC viewer online?',
    answer: 'Yes. You can open and preview HEIC or HEIF photos directly in your browser without installing software.'
  },
  {
    question: 'Is this online HEIC viewer private?',
    answer: 'Yes. Your image is decoded locally in your browser session and is not uploaded to a server.'
  },
  {
    question: 'Can I view HEIC files on Windows with this tool?',
    answer: 'Yes. This browser-based HEIC viewer can help you preview HEIC files even when your default photo app cannot open them. Browser compatibility may still vary by HEIC variant.'
  },
  {
    question: 'Do I need to convert HEIC to JPG first?',
    answer: 'No. You can preview the HEIC file first, then optionally download a JPG or PNG copy if you need a more compatible format.'
  },
  {
    question: 'Can I save the image as JPG or PNG?',
    answer: 'Yes. After the preview is ready, use the JPG or PNG download buttons to create a more widely supported copy.'
  },
  {
    question: 'Should I choose JPG or PNG?',
    answer: 'Choose JPG for broad compatibility. Choose PNG when you want a lossless copy for documentation, screenshots, or design workflows.'
  },
  {
    question: 'Can this repair a corrupted HEIC file?',
    answer: 'No. This is a viewer and export helper, not a photo repair tool.'
  }
];

export const heicFaqGroups: HeicFaqGroup[] = [
  {
    id: 'heic-viewer',
    title: 'HEIC Viewer FAQ',
    description: 'Questions about opening, previewing, and privately viewing HEIC or HEIF photos online.',
    items: heicViewerFaqs
  }
];
