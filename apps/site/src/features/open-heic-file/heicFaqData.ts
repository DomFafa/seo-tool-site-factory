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
    question: 'Does this upload my image?',
    answer: 'No. The selected HEIC or HEIF file is decoded in your browser session. The tool does not need a server upload to preview or export the file.'
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
    question: 'Does this work without the Windows HEVC extension?',
    answer: 'The browser-side decoder is separate from Windows Photos or the Microsoft HEVC extension. Final compatibility still depends on the browser and HEIC variant.'
  },
  {
    question: 'Can this repair a corrupted HEIC file?',
    answer: 'No. This is a viewer and export helper, not a photo repair tool.'
  }
];

export const heicToPdfFaqs: HeicFaqItem[] = [
  {
    question: 'Can I convert HEIC to PDF online?',
    answer: 'Yes. You can choose one or more HEIC or HEIF photos, preview them, and create a PDF in your browser.'
  },
  {
    question: 'Are my HEIC files uploaded?',
    answer: 'No. The conversion is designed to happen in your browser session. Your selected images should not be uploaded to a server.'
  },
  {
    question: 'Can I combine multiple HEIC files into one PDF?',
    answer: 'Yes. The HEIC to PDF tool is designed to support multiple HEIC or HEIF files and place each image on its own PDF page.'
  },
  {
    question: 'Can I choose A4 or Letter PDF size?',
    answer: 'Yes. PDF options include Auto, A4, and Letter, with simple orientation and margin controls.'
  },
  {
    question: 'Will this work on Windows?',
    answer: 'It is designed for modern browsers. Some HEIC variants may depend on browser compatibility, so if one file does not preview, try another browser.'
  },
  {
    question: 'Is HEIC to PDF different from HEIC to JPG or PNG?',
    answer: 'Yes. JPG and PNG create image files, while PDF creates a document that is easier to share, print, or upload where a PDF is required.'
  }
];

export const heicFaqGroups: HeicFaqGroup[] = [
  {
    id: 'heic-viewer',
    title: 'HEIC Viewer FAQ',
    description: 'Questions about opening, previewing, and privately viewing HEIC or HEIF photos online.',
    items: heicViewerFaqs
  },
  {
    id: 'heic-to-pdf',
    title: 'HEIC to PDF FAQ',
    description: 'Questions about converting HEIC or HEIF photos into PDF documents in the browser.',
    items: heicToPdfFaqs
  }
];
