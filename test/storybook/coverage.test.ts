import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '../..');
const SRC = join(ROOT, 'src');
const STORIES = join(ROOT, 'stories');

const CUSTOM_ELEMENT_RE = /@customElement\(\s*['"]([a-z0-9-]+)['"]\s*\)/g;
const STORY_COMPONENT_RE = /component:\s*['"]([a-z0-9-]+)['"]/g;

function walkTs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      out.push(...walkTs(path));
    } else if (extname(path) === '.ts') {
      out.push(path);
    }
  }
  return out;
}

function collect(dir: string, glob: string, re: RegExp): string[] {
  const tags = new Set<string>();
  const files = walkTs(dir).filter((f) => (glob ? f.endsWith(glob) : true));
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    re.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text))) {
      const tag = match[1];
      if (tag) tags.add(tag);
    }
  }
  return [...tags].sort();
}

describe('Storybook custom-element coverage', () => {
  it('has a CSF story for every @customElement in src/', () => {
    const elements = collect(SRC, '', CUSTOM_ELEMENT_RE);
    const storyTags = collect(STORIES, '.stories.ts', STORY_COMPONENT_RE);
    const missing = elements.filter((tag) => !storyTags.includes(tag));

    expect(elements.length).toBeGreaterThan(0);
    expect(missing, `Missing stories for: ${missing.join(', ')}`).toEqual([]);
  });

  it('shows vertical and horizontal content_layout for AuActionCardBase cards', () => {
    const tags: string[] = [];
    for (const file of walkTs(join(SRC, 'card'))) {
      const text = readFileSync(file, 'utf8');
      if (!text.includes('extends AuActionCardBase')) continue;
      CUSTOM_ELEMENT_RE.lastIndex = 0;
      const match = CUSTOM_ELEMENT_RE.exec(text);
      if (match?.[1]) tags.push(match[1]);
    }

    const storyFiles = walkTs(STORIES).filter((f) => f.endsWith('.stories.ts'));
    const missing = tags.filter((tag) => {
      const file = storyFiles.find((path) => {
        const text = readFileSync(path, 'utf8');
        return text.includes(`component: '${tag}'`);
      });
      if (!file) return true;
      return !readFileSync(file, 'utf8').includes('mountCardLayouts');
    });

    expect(tags.length).toBeGreaterThan(0);
    expect(missing, `Missing layout pair stories for: ${missing.join(', ')}`).toEqual([]);
  });

  it('includes climate temperature_control buttons', () => {
    const file = join(STORIES, 'cards/au-climate-card.stories.ts');
    const text = readFileSync(file, 'utf8');
    expect(
      text.includes("temperature_control: 'buttons'"),
      'Climate Card stories must include temperature_control: buttons',
    ).toBe(true);
  });

  it('includes fan glance Home and speed_control button stories', () => {
    const file = join(STORIES, 'cards/au-fan-card.stories.ts');
    const text = readFileSync(file, 'utf8');
    expect(
      text.includes('show_speed: false'),
      'Fan Card Home glance must hide extra controls',
    ).toBe(true);
    expect(
      text.includes("speed_control: 'button'"),
      'Fan Card stories must include speed_control: button',
    ).toBe(true);
  });
});
