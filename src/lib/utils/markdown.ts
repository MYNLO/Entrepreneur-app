import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function renderMarkdown(text: string): string {
  if (!text) return '';
  const html = marked.parse(text, { breaks: true, gfm: true });
  return DOMPurify.sanitize(html as string);
}