'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  set,
  unset,
  ObjectInputProps,
  NumberInputProps,
  useFormValue,
} from 'sanity';

// ============================================================================
// تحويل البلوكات المحفوظة في سانتي إلى نص عادي عند فتح الصفحة فقط
// ============================================================================
function blocksToEditableText(blocks: any): string {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  if (!Array.isArray(blocks)) return '';

  return blocks
    .map((block: any) => {
      if (block?._type !== 'block' || !Array.isArray(block.children)) return '';
      const text = block.children
        .map((c: any) => {
          const t = c.text || '';
          if (Array.isArray(c.marks) && c.marks.includes('strong') && t.trim()) {
            return `**${t}**`;
          }
          return t;
        })
        .join('');

      if (block.listItem === 'bullet') return `• ${text}`;
      if (block.listItem === 'number') return `1. ${text}`;
      if (block.style === 'h2') return `## ${text}`;
      if (block.style === 'h3') return `### ${text}`;
      return text;
    })
    .join('\n');
}

// تقطيع السطر لدعم الـ Bold (**كلمة** أو الكلمة اللي قبل النقطتين ":")
function parseSpansWithBold(text: string, uniqueKey: string): any[] {
  if (text.includes('**')) {
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return {
          _type: 'span',
          _key: `s_${uniqueKey}_${i}`,
          text: part.slice(2, -2),
          marks: ['strong'],
        };
      }
      return {
        _type: 'span',
        _key: `s_${uniqueKey}_${i}`,
        text: part,
        marks: [],
      };
    });
  }

  const colonMatch = text.match(/^([^:]{2,45}:)(\s+.*)$/);
  if (colonMatch) {
    return [
      {
        _type: 'span',
        _key: `s_${uniqueKey}_b`,
        text: colonMatch[1],
        marks: ['strong'],
      },
      {
        _type: 'span',
        _key: `s_${uniqueKey}_n`,
        text: colonMatch[2],
        marks: [],
      },
    ];
  }

  return [
    {
      _type: 'span',
      _key: `s_${uniqueKey}_0`,
      text,
      marks: [],
    },
  ];
}

// تحويل النص إلى بلوكات سانتي بدون أي تدخل تلقائي يغير كلامك أثناء الكتابة
function editableTextToBlocks(text: string, langPrefix: string = 'blk'): any[] {
  if (!text || !text.trim()) return [];
  const lines = text.split('\n');

  return lines
    .map((rawLine, idx) => {
      if (!rawLine.trim()) return null;

      const line = rawLine;
      const trimmedStart = line.trimStart();
      const uniqueKey = `${langPrefix}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
      let style = 'normal';
      let listItem: string | undefined = undefined;
      let cleanText = line;

      if (/^([•\-*▪▸])\s+/.test(trimmedStart)) {
        listItem = 'bullet';
        cleanText = trimmedStart.replace(/^([•\-*▪▸])\s+/, '');
      } else if (/^\d+[.)]\s+/.test(trimmedStart)) {
        listItem = 'number';
        cleanText = trimmedStart.replace(/^\d+[.)]\s+/, '');
      } else if (trimmedStart.startsWith('### ')) {
        style = 'h3';
        cleanText = trimmedStart.replace(/^###\s+/, '');
      } else if (trimmedStart.startsWith('## ')) {
        style = 'h2';
        cleanText = trimmedStart.replace(/^##\s+/, '');
      }

      return {
        _type: 'block',
        _key: `b_${uniqueKey}`,
        style,
        markDefs: [],
        ...(listItem ? { listItem, level: 1 } : {}),
        children: parseSpansWithBold(cleanText, uniqueKey),
      };
    })
    .filter(Boolean);
}

// ============================================================================
// تحويل النص المنسوخ (Copy & Paste) مع الحفاظ على النقاط والعناوين والـ Bold
// ============================================================================
function formatPastedContent(htmlData: string, plainData: string): string {
  // 1. لو الكوبي جاي من صفحة ويب أو Word أو ChatGPT وفيه HTML Tags
  if (typeof window !== 'undefined' && htmlData && /<(li|h[1-6]|strong|b|ul|ol|p)/i.test(htmlData)) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');

    const walk = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const childrenText = Array.from(el.childNodes).map(walk).join('');

      if (!childrenText.trim()) return tag === 'br' ? '\n' : '';

      if (tag === 'h1' || tag === 'h2') return `\n## ${childrenText.trim()}\n`;
      if (tag === 'h3' || tag === 'h4' || tag === 'h5') return `\n### ${childrenText.trim()}\n`;
      if (tag === 'li') {
        const cleanLi = childrenText.replace(/\n+/g, ' ').trim();
        const isOrdered = el.parentElement?.tagName.toLowerCase() === 'ol';
        return isOrdered ? `\n1. ${cleanLi}\n` : `\n• ${cleanLi}\n`;
      }
      if (tag === 'strong' || tag === 'b') {
        return `**${childrenText.trim()}**`;
      }
      if (tag === 'p' || tag === 'div' || tag === 'section' || tag === 'ul' || tag === 'ol') {
        return `\n${childrenText.trim()}\n`;
      }
      if (tag === 'br') return '\n';

      return childrenText;
    };

    const parsed = walk(doc.body)
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    // تنسيق إضافي للسطور داخل النص المنسوخ (مثل العناوين أو Duration: ...)
    return parsed
      .map((line) => {
        if (/^([•\-*]|\d+[.)]|##|###)\s/.test(line)) return line;
        const cleanNoBold = line.replace(/\*\*/g, '');
        if (/^[^:]{2,45}:\s+.+/.test(cleanNoBold)) {
          return `• ${cleanNoBold}`;
        }
        if (cleanNoBold.length >= 4 && cleanNoBold.length <= 65 && !/[.,;!؟?]$/.test(cleanNoBold)) {
          return `### ${cleanNoBold}`;
        }
        return line;
      })
      .join('\n');
  }

  // 2. لو الكوبي نص عادي (Plain Text) منسوخ بدون HTML
  if (plainData) {
    return plainData
      .split('\n')
      .map((rawLine) => {
        const t = rawLine.trim();
        if (!t) return '';
        if (/^([•\-*▪▸]|\d+[.)]|##|###)\s/.test(t)) {
          return t.replace(/^[\-*▪▸]\s+/, '• ');
        }
        // أي سطر بصيغة "Duration: 1 day" يتحول لنقطة تلقائياً عند اللصق
        if (/^[^:]{2,45}:\s+.+/.test(t)) {
          return `• ${t}`;
        }
        // أي سطر قصير لا ينتهي بنقطة (مثل Course Overview & Specifications) يتحول لعنوان فرعي عند اللصق
        if (t.length >= 4 && t.length <= 65 && !/[.,;!؟?]$/.test(t)) {
          return `### ${t}`;
        }
        return t;
      })
      .filter(Boolean)
      .join('\n');
  }

  return '';
}

// ==========================================
// 1. مكون AutoTranslate Pro (مستطيل كبير + كتابة حرة + لصق منسق تلقائياً)
// ==========================================
export function AutoTranslateInput(props: ObjectInputProps) {
  const { value = {}, onChange, schemaType } = props;
  const [activeLang, setActiveLang] = useState<'en' | 'de' | 'fr' | 'pl'>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isBlockArray = schemaType.fields.some(
    (f) => f.name === 'en' && f.type.name === 'array'
  );

  const [localTexts, setLocalTexts] = useState<Record<string, string>>(() => ({
    en: isBlockArray ? blocksToEditableText((value as any)?.en) : ((value as any)?.en || ''),
    de: isBlockArray ? blocksToEditableText((value as any)?.de) : ((value as any)?.de || ''),
    fr: isBlockArray ? blocksToEditableText((value as any)?.fr) : ((value as any)?.fr || ''),
    pl: isBlockArray ? blocksToEditableText((value as any)?.pl) : ((value as any)?.pl || ''),
  }));

  useEffect(() => {
    setLocalTexts((prev) => {
      const next = { ...prev };
      let changed = false;
      (['en', 'de', 'fr', 'pl'] as const).forEach((lang) => {
        const dbVal = (value as any)?.[lang];
        const dbStr = isBlockArray ? blocksToEditableText(dbVal) : (dbVal || '');
        if (!prev[lang] && dbStr) {
          next[lang] = dbStr;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [value, isBlockArray]);

  const currentText = localTexts[activeLang] ?? '';

  const syncToSanity = (newText: string, lang: 'en' | 'de' | 'fr' | 'pl') => {
    if (!newText.trim()) {
      onChange(unset([lang]));
      return;
    }
    if (isBlockArray) {
      const blocks = editableTextToBlocks(newText, lang);
      onChange(set(blocks, [lang]));
    } else {
      onChange(set(newText, [lang]));
    }
  };

  // الكتابة اليدوية الحرة 100% بدون أي تدخل
  const handleLocalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalTexts((prev) => ({ ...prev, [activeLang]: newText }));
    syncToSanity(newText, activeLang);
  };

  // عند عمل Copy & Paste فقط: يحافظ على التنسيق والنقاط والعناوين تلقائياً
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!isBlockArray) return;

    const htmlData = e.clipboardData.getData('text/html');
    const plainData = e.clipboardData.getData('text/plain');
    const formattedPaste = formatPastedContent(htmlData, plainData);

    if (formattedPaste) {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart ?? currentText.length;
      const end = el.selectionEnd ?? currentText.length;

      const before = currentText.slice(0, start);
      const after = currentText.slice(end);
      const prefixNewline = before.length > 0 && !before.endsWith('\n') ? '\n' : '';
      const suffixNewline = after.length > 0 && !after.startsWith('\n') ? '\n' : '';

      const newText = `${before}${prefixNewline}${formattedPaste}${suffixNewline}${after}`;
      setLocalTexts((prev) => ({ ...prev, [activeLang]: newText }));
      syncToSanity(newText, activeLang);
    }
  };

  const insertAtCurrentLine = (prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = currentText;

    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEndIdx = text.indexOf('\n', end);
    const lineEnd = lineEndIdx === -1 ? text.length : lineEndIdx;

    const selectedLines = text.slice(lineStart, lineEnd).split('\n');
    const modifiedLines = selectedLines.map((line, i) => {
      const cleanLine = line.replace(/^(\s*)([•\-*]|\d+[.)]|###|##)\s+/, '');
      if (prefix === '1. ') return `${i + 1}. ${cleanLine}`;
      return `${prefix}${cleanLine}`;
    });

    const newText = text.slice(0, lineStart) + modifiedLines.join('\n') + text.slice(lineEnd);
    setLocalTexts((prev) => ({ ...prev, [activeLang]: newText }));
    syncToSanity(newText, activeLang);

    setTimeout(() => {
      el.focus();
    }, 10);
  };

  const makeSelectionBold = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = currentText.slice(start, end);

    const newText = selected
      ? currentText.slice(0, start) + `**${selected}**` + currentText.slice(end)
      : currentText.slice(0, start) + `**نص عريض**` + currentText.slice(end);

    setLocalTexts((prev) => ({ ...prev, [activeLang]: newText }));
    syncToSanity(newText, activeLang);
    setTimeout(() => el.focus(), 10);
  };

  const formatCopiedTextManual = () => {
    if (!currentText.trim()) return;
    const formatted = formatPastedContent('', currentText);
    setLocalTexts((prev) => ({ ...prev, [activeLang]: formatted }));
    syncToSanity(formatted, activeLang);
  };

  const translateString = async (text: string, targetLang: string): Promise<string> => {
    if (!text || !text.trim()) return '';
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return data[0]?.map((item: any[]) => item[0]).join('') || text;
  };

  const triggerAutoTranslateAll = async () => {
    const enText = localTexts.en || '';
    if (!enText.trim()) {
      alert('اكتب النص الإنجليزي (EN) الأول قبل الترجمة.');
      return;
    }

    setIsTranslating(true);
    try {
      const targetLangs: Array<'de' | 'fr' | 'pl'> = ['de', 'fr', 'pl'];
      const newLocal = { ...localTexts };

      for (const lang of targetLangs) {
        if (!isBlockArray) {
          const translated = await translateString(enText, lang);
          if (translated) {
            newLocal[lang] = translated;
            onChange(set(translated, [lang]));
          }
        } else {
          const lines = enText.split('\n');
          const translatedLines = await Promise.all(
            lines.map(async (line) => {
              const trimmed = line.trim();
              if (!trimmed) return '';

              let prefix = '';
              let contentToTranslate = trimmed;

              if (/^([•\-*])\s+/.test(trimmed)) {
                prefix = '• ';
                contentToTranslate = trimmed.replace(/^([•\-*])\s+/, '');
              } else if (/^\d+[.)]\s+/.test(trimmed)) {
                const numMatch = trimmed.match(/^\d+[.)]\s+/);
                prefix = numMatch ? numMatch[0] : '1. ';
                contentToTranslate = trimmed.replace(/^\d+[.)]\s+/, '');
              } else if (trimmed.startsWith('### ')) {
                prefix = '### ';
                contentToTranslate = trimmed.replace(/^###\s+/, '');
              } else if (trimmed.startsWith('## ')) {
                prefix = '## ';
                contentToTranslate = trimmed.replace(/^##\s+/, '');
              }

              const cleanForTranslate = contentToTranslate.replace(/\*\*/g, '');
              const tr = await translateString(cleanForTranslate, lang);
              return `${prefix}${tr}`;
            })
          );
          const joined = translatedLines.join('\n');
          newLocal[lang] = joined;
          onChange(set(editableTextToBlocks(joined, lang), [lang]));
        }
      }
      setLocalTexts(newLocal);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const langs: Array<{ key: 'en' | 'de' | 'fr' | 'pl'; label: string }> = [
    { key: 'en', label: '🇬🇧 EN' },
    { key: 'de', label: '🇩🇪 DE' },
    { key: 'fr', label: '🇫🇷 FR' },
    { key: 'pl', label: '🇵🇱 PL' },
  ];

  return (
    <div
      style={{
        border: '1px solid #29303f',
        borderRadius: 8,
        background: '#15181f',
        padding: 16,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* شريط التبويبات للغات الأربع */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #29303f',
          paddingBottom: 10,
          marginBottom: 10,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {langs.map((l) => {
            const isFilled = Boolean(localTexts[l.key]?.trim());
            const isActive = activeLang === l.key;
            return (
              <button
                key={l.key}
                type="button"
                onClick={() => setActiveLang(l.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: isActive ? '#272d3b' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: isActive ? '1px solid #434e64' : '1px solid transparent',
                }}
              >
                <span>{l.label}</span>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isFilled ? (l.key === 'en' ? '#60a5fa' : '#34d399') : '#475569',
                  }}
                />
              </button>
            );
          })}
        </div>

        <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
          {currentText.length} chars
        </span>
      </div>

      {/* شريط أزرار التنسيق */}
      {isBlockArray && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 10,
            flexWrap: 'wrap',
            background: '#0e1014',
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #29303f',
          }}
        >
          <button
            type="button"
            onClick={() => insertAtCurrentLine('• ')}
            style={{
              padding: '5px 10px',
              fontSize: 12,
              borderRadius: 4,
              background: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #334155',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            • نقطة (Bullet)
          </button>

          <button
            type="button"
            onClick={() => insertAtCurrentLine('1. ')}
            style={{
              padding: '5px 10px',
              fontSize: 12,
              borderRadius: 4,
              background: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #334155',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            1. ترقيم (Number)
          </button>

          <button
            type="button"
            onClick={() => insertAtCurrentLine('## ')}
            style={{
              padding: '5px 10px',
              fontSize: 12,
              borderRadius: 4,
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            عنوان كبير (H2)
          </button>

          <button
            type="button"
            onClick={() => insertAtCurrentLine('### ')}
            style={{
              padding: '5px 10px',
              fontSize: 12,
              borderRadius: 4,
              background: '#1e293b',
              color: '#cbd5e1',
              border: '1px solid #334155',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            عنوان فرعي (H3)
          </button>

          <button
            type="button"
            onClick={makeSelectionBold}
            style={{
              padding: '5px 10px',
              fontSize: 12,
              borderRadius: 4,
              background: '#1e293b',
              color: '#fbbf24',
              border: '1px solid #334155',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            B خط عريض
          </button>

          <button
            type="button"
            onClick={formatCopiedTextManual}
            style={{
              padding: '5px 12px',
              fontSize: 12,
              borderRadius: 4,
              background: '#065f46',
              color: '#34d399',
              border: '1px solid #059669',
              cursor: 'pointer',
              fontWeight: 700,
              marginLeft: 'auto',
            }}
          >
            🪄 تنسيق النص الحالي تلقائياً
          </button>
        </div>
      )}

      {/* مستطيل الكتابة الكبير والواسع (يدعم الكوبي بيست المنسق + الكتابة اليدوية الحرة) */}
      <textarea
        ref={textareaRef}
        rows={isBlockArray ? 16 : 4}
        value={currentText}
        onChange={handleLocalChange}
        onPaste={handlePaste}
        placeholder={
          isBlockArray
            ? `اكتب براحتك أو الصق النص (Ctrl+V) وسيتم الحفاظ على النقاط والعناوين تلقائياً...`
            : `Enter content in ${activeLang.toUpperCase()}...`
        }
        style={{
          width: '100%',
          minHeight: isBlockArray ? '360px' : '95px',
          boxSizing: 'border-box',
          background: '#0e1014',
          border: '1px solid #334155',
          borderRadius: 8,
          padding: 16,
          color: '#ffffff',
          fontSize: 14,
          lineHeight: 1.75,
          outline: 'none',
          resize: 'vertical',
        }}
      />

      {/* معاينة حية لشكل التنسيق في الموقع */}
      {isBlockArray && currentText.trim() && (
        <div
          style={{
            marginTop: 12,
            padding: 16,
            borderRadius: 8,
            background: '#0b1120',
            border: '1px solid #1e293b',
            maxHeight: 320,
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', marginBottom: 10, textTransform: 'uppercase' }}>
            👁️ معاينة شكل النص المنسق في الموقع (Live Website Preview):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>
            {currentText.split('\n').map((line, i) => {
              const t = line.trim();
              if (!t) return <div key={i} style={{ height: 6 }} />;
              if (t.startsWith('## ')) {
                return (
                  <div key={i} style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 6, borderBottom: '1px solid #1e293b', paddingBottom: 4 }}>
                    {t.replace(/^##\s+/, '')}
                  </div>
                );
              }
              if (t.startsWith('### ')) {
                return (
                  <div key={i} style={{ fontSize: 15, fontWeight: 700, color: '#38bdf8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 4, height: 16, background: '#06b6d4', borderRadius: 4, display: 'inline-block' }} />
                    <span>{t.replace(/^###\s+/, '')}</span>
                  </div>
                );
              }
              if (/^([•\-*])\s+/.test(t)) {
                const clean = t.replace(/^([•\-*])\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1');
                const colonIdx = clean.indexOf(':');
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, paddingLeft: 6 }}>
                    <span style={{ color: '#38bdf8', fontWeight: 900 }}>•</span>
                    <span>
                      {colonIdx > 0 && colonIdx < 45 ? (
                        <>
                          <strong style={{ color: '#ffffff' }}>{clean.slice(0, colonIdx + 1)}</strong>
                          {clean.slice(colonIdx + 1)}
                        </>
                      ) : (
                        clean
                      )}
                    </span>
                  </div>
                );
              }
              if (/^\d+[.)]\s+/.test(t)) {
                return (
                  <div key={i} style={{ paddingLeft: 6, color: '#e2e8f0' }}>
                    {t.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </div>
                );
              }
              return <div key={i}>{t.replace(/\*\*(.*?)\*\*/g, '$1')}</div>;
            })}
          </div>
        </div>
      )}

      {/* شريط زر الترجمة الفورية */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
        <button
          type="button"
          onClick={triggerAutoTranslateAll}
          disabled={isTranslating}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 6,
            background: 'rgba(37, 99, 235, 0.2)',
            color: '#60a5fa',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            cursor: isTranslating ? 'wait' : 'pointer',
          }}
        >
          {isTranslating ? '⏳ جاري الترجمة مع حفظ التنسيق...' : '✨ Auto-Translate to DE, FR, PL'}
        </button>

        <span style={{ fontSize: 12, color: '#34d399', fontWeight: 500 }}>
          ✓ اللصق المنسق والكتابة الحرة مفعلة
        </span>
      </div>
    </div>
  );
}

// ==========================================
// 2. مكون حاسبة العملات (Base Price & FX Engine)
// ==========================================
export function PriceFxInput(props: NumberInputProps) {
  const eur = Number(props.value) || 0;
  const usd = (eur * 1.08).toFixed(2);
  const egp = Math.round(eur * 53).toLocaleString();

  return (
    <div style={{ background: '#15181f', border: '1px solid #29303f', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #29303f' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Base Price & Multi-Currency FX Engine</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Input standard pricing in Euros (€). USD & EGP equivalents are computed automatically.</div>
        </div>
        <span style={{ fontSize: 10, background: '#064e3b', color: '#34d399', border: '1px solid #065f46', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
          FX Live Sync
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, alignItems: 'center' }}>
        <div style={{ background: '#ffffff', color: '#0f172a', padding: 10, borderRadius: 6 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#0f172a', marginBottom: 4, fontWeight: 700 }}>Base Price (EUR €)</label>
          {props.renderDefault(props)}
        </div>

        <div style={{ padding: 12, background: '#0e1014', border: '1px solid #29303f', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>USD Equivalent</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399', marginTop: 2 }}>${usd}</div>
          <div style={{ fontSize: 10, color: '#64748b' }}>Rate: 1€ = $1.08</div>
        </div>

        <div style={{ padding: 12, background: '#0e1014', border: '1px solid #29303f', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Local Egyptian (EGP)</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24', marginTop: 2 }}>{egp} E£</div>
          <div style={{ fontSize: 10, color: '#64748b' }}>Rate: 1€ = 53.00 EGP</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. مكون إدارة سعة القارب والمقاعد (Capacity & Ops)
// ==========================================
export function CapacityOpsInput(props: ObjectInputProps) {
  const val = (props.value as { vessel?: string; maxCapacity?: number; bookedCapacity?: number; crewNotes?: string }) || {};
  const maxPax = val.maxCapacity || 20;
  const bookedPax = val.bookedCapacity || 0;
  const remaining = Math.max(0, maxPax - bookedPax);
  const percentage = Math.min(100, Math.round((bookedPax / Math.max(1, maxPax)) * 100));

  const statusText =
    remaining <= 0
      ? 'Sold Out (0 Left)'
      : remaining <= 4
      ? `Limited Seats (${remaining} Left!)`
      : `Available (${remaining} Seats)`;

  const statusColor = remaining <= 0 ? '#f59e0b' : remaining <= 4 ? '#fbbf24' : '#34d399';

  return (
    <div style={{ background: '#15181f', border: '1px solid #29303f', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #29303f' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>🛥️ Boat Assignment & Live Seat Capacity</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Manage guest roster, vessel assignments, and real-time booking badges.</div>
        </div>
        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#0e1014', color: statusColor, border: `1px solid ${statusColor}` }}>
          {statusText}
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
          <span>Capacity Utilization</span>
          <strong style={{ color: '#ffffff', fontFamily: 'monospace' }}>
            {bookedPax} / {maxPax} Seats Booked ({percentage}%)
          </strong>
        </div>
        <div style={{ width: '100%', height: 10, background: '#0e1014', borderRadius: 999, overflow: 'hidden', border: '1px solid #29303f' }}>
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              background: remaining <= 4 ? '#f59e0b' : '#10b981',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <div style={{ background: '#ffffff', color: '#0f172a', padding: 14, borderRadius: 8 }}>
        {props.renderDefault(props)}
      </div>
    </div>
  );
}

// ==========================================
// 4. مكون معاينة الواتساب ومولد روابط UTM
// ==========================================
export function WhatsAppMarketingInput(props: ObjectInputProps) {
  const val = (props.value as { utmSource?: string; whatsappPhone?: string; customMessage?: string }) || {};

  const docSlug = useFormValue(['slug', 'current']) as string | undefined;
  const docTitle = useFormValue(['pageTitle', 'en']) as string | undefined;
  const docPrice = useFormValue(['basePriceEur']) as number | undefined;

  const utmSource = val.utmSource || 'instagram_bio';
  const phone = val.whatsappPhone || '201273327311';

  const slugPath = docSlug ? `/${docSlug}` : '';
  const generatedUrl = `https://www.thelighthousee.com/en/services${slugPath}?utm_source=${utmSource}`;

  const defaultPreviewMsg = `Hello The Light House Diving Center! 🤿 I want to book ${docTitle || 'this adventure'}${docPrice ? ` (€${docPrice})` : ''}. Please confirm current seat availability.`;

  return (
    <div style={{ background: '#15181f', border: '1px solid #29303f', borderRadius: 8, padding: 16, color: '#f1f5f9' }}>
      <div style={{ marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #29303f' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>💬 WhatsApp Direct Inquiry & UTM Link Generator</div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Pre-fills customer WhatsApp chat and tracks marketing campaign conversions.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#0b141a', borderRadius: 12, padding: 14, border: '1px solid #222d34' }}>
          <div style={{ fontSize: 10, color: '#8696a0', textAlign: 'center', marginBottom: 8 }}>
            TODAY • WHATSAPP PREVIEW (+{phone})
          </div>
          <div style={{ background: '#005c4b', color: '#e9edef', borderRadius: 8, padding: 12, fontSize: 12, lineHeight: 1.5 }}>
            {val.customMessage || defaultPreviewMsg}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1' }}>Generated Trackable Campaign URL:</div>
          <div style={{ display: 'flex', background: '#0e1014', border: '1px solid #29303f', borderRadius: 6, overflow: 'hidden' }}>
            <input
              type="text"
              readOnly
              value={generatedUrl}
              style={{ flex: 1, background: 'transparent', border: 'none', padding: '8px 10px', color: '#60a5fa', fontSize: 11, fontFamily: 'monospace' }}
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(generatedUrl)}
              style={{ background: '#212632', color: '#ffffff', border: 'none', borderLeft: '1px solid #29303f', padding: '0 12px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
            >
              Copy
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#93c5fd', background: 'rgba(30, 58, 138, 0.25)', border: '1px solid rgba(30, 64, 175, 0.5)', padding: 8, borderRadius: 6 }}>
            💡 Just click Copy and paste it directly into your Instagram, Facebook, or Ads!
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', color: '#0f172a', padding: 14, borderRadius: 8 }}>
        {props.renderDefault(props)}
      </div>
    </div>
  );
}