"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SectionHeading from "./SectionHeading";
import {
  ExternalLink,
  FileText,
  Layers3,
  Mail,
  MonitorSmartphone,
  Package,
  PenSquare,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cases, type PortfolioCase } from "@/data/cases";
import { cn } from "@/lib/utils";

const notionProseClass =
  "prose prose-slate max-w-none " +
  "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-950 " +
  "prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl " +
  "prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl " +
  "prose-p:text-slate-600 prose-p:leading-[1.9] prose-p:mb-5 " +
  "prose-li:text-slate-600 prose-li:leading-[1.8] " +
  "prose-ul:my-5 prose-ul:space-y-2 " +
  "prose-strong:text-slate-900 prose-strong:font-semibold " +
  "prose-img:rounded-2xl prose-img:shadow-[0_20px_50px_rgba(15,23,42,0.12)] " +
  "prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline " +
  "prose-blockquote:border-l-amber-400 prose-blockquote:bg-amber-50/60 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-2xl " +
  "prose-code:text-[0.92em] prose-code:text-slate-800 " +
  "prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-950";

const filterPriority = [
  "Примеры текстов",
  "Статьи",
  "Тексты рассылок",
  "Упаковка кейсов",
  "Кейсы",
  "Сайты",
  "Лендинги",
  "Email",
  "AI",
  "IT",
  "PropTech",
];

const cardTagPriority = [
  "Email",
  "Тексты рассылок",
  "Статьи",
  "Упаковка кейсов",
  "Примеры текстов",
  "Кейсы",
  "Сайты",
  "Лендинги",
  "AI",
  "IT",
  "PropTech",
];

const getPriorityIndex = (value: string, order: string[]) => {
  const index = order.findIndex(
    (item) => item.toLowerCase() === value.toLowerCase()
  );
  return index === -1 ? 999 : index;
};

const sortTagsForFilters = (tags: string[]) => {
  return [...tags].sort((a, b) => {
    const pa = getPriorityIndex(a, filterPriority);
    const pb = getPriorityIndex(b, filterPriority);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b, "ru");
  });
};

const sortTagsForCard = (tags: string[]) => {
  return [...tags].sort((a, b) => {
    const pa = getPriorityIndex(a, cardTagPriority);
    const pb = getPriorityIndex(b, cardTagPriority);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b, "ru");
  });
};

const getTagMeta = (tag: string) => {
  const t = tag.toLowerCase();

  if (t.includes("email")) {
    return {
      icon: Mail,
      className:
        "border-[rgba(173,155,255,0.24)] bg-[rgba(236,232,255,0.92)] text-[#6f60b8]",
    };
  }
  if (t.includes("стат")) {
    return {
      icon: FileText,
      className:
        "border-[rgba(255,205,86,0.24)] bg-[rgba(255,231,163,0.34)] text-[#8a5a00]",
    };
  }
  if (t.includes("рассыл")) {
    return {
      icon: Mail,
      className:
        "border-[rgba(239,173,72,0.24)] bg-[rgba(255,223,181,0.32)] text-[#935b11]",
    };
  }
  if (t.includes("упаков") || t.includes("позиционир") || t.includes("бренд")) {
    return {
      icon: Package,
      className:
        "border-[rgba(162,192,224,0.24)] bg-[rgba(211,232,250,0.34)] text-[#4e6d8a]",
    };
  }
  if (t.includes("кейс")) {
    return {
      icon: Layers3,
      className:
        "border-[rgba(170,205,183,0.24)] bg-[rgba(214,239,221,0.34)] text-[#567260]",
    };
  }
  if (t.includes("сайт") || t.includes("лендинг")) {
    return {
      icon: MonitorSmartphone,
      className:
        "border-[rgba(190,184,236,0.24)] bg-[rgba(232,228,251,0.34)] text-[#675d96]",
    };
  }
  if (t.includes("текст")) {
    return {
      icon: PenSquare,
      className:
        "border-[rgba(230,192,146,0.24)] bg-[rgba(247,229,206,0.38)] text-[#8b6640]",
    };
  }
  if (t.includes("ai")) {
    return {
      icon: Sparkles,
      className:
        "border-[rgba(162,224,208,0.24)] bg-[rgba(216,246,239,0.36)] text-[#3c7f6d]",
    };
  }

  return {
    icon: Tags,
    className:
      "border-slate-200/80 bg-[rgba(241,242,244,0.92)] text-slate-600",
  };
};

const hasUsableDescription = (item: PortfolioCase) => {
  const text = (item.description ?? "").trim();
  return text.length > 20;
};

const CasesSection = () => {
  const [active, setActive] = useState<PortfolioCase | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    cases.forEach((c) => c.tags.forEach((t) => set.add(t.trim())));
    return sortTagsForFilters(Array.from(set));
  }, []);

  const filteredCases = useMemo(() => {
    if (filterTag == null) return cases;
    return cases.filter((c) => c.tags.includes(filterTag));
  }, [filterTag]);

  const applyFilter = (tag: string) => {
    setFilterTag(tag);
    setActive(null);
  };

  return (
    <section className="relative py-24 md:py-32" id="portfolio">
      <div className="container relative z-10 mx-auto max-w-[1280px] px-6">
        <div className="mb-14">
          <SectionHeading
            title="Кейсы"
            subtitle="От упаковки смыслов до сайтов, которые приносят конверсию. Разбираем проекты по косточкам: какая была задача и что получилось на выходе."
          />
        </div>

        <div className="mb-12 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setFilterTag(null)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300",
              "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
              filterTag === null
                ? "border-amber-300/70 bg-[linear-gradient(180deg,rgba(255,224,138,0.96),rgba(255,202,74,0.9))] text-slate-900 shadow-[0_14px_28px_rgba(251,191,36,0.18)]"
                : "border-white/80 bg-white/72 text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] hover:border-slate-200 hover:bg-white hover:text-slate-700"
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>Все</span>
          </button>

          {allTags.map((tag) => {
            const meta = getTagMeta(tag);
            const Icon = meta.icon;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => setFilterTag(tag)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300",
                  "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
                  filterTag === tag
                    ? cn(
                        "shadow-[0_12px_28px_rgba(15,23,42,0.08)]",
                        meta.className
                      )
                    : "border-white/80 bg-white/72 text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] hover:border-slate-200 hover:bg-white hover:text-slate-700"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((c) => {
            const sortedCardTags = sortTagsForCard(c.tags).slice(0, 3);

            return (
              <article
                key={c.id}
                onClick={() => setActive(c)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.72))] p-3 shadow-[0_18px_42px_rgba(15,23,42,0.07)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-[1px] rounded-[29px] bg-[linear-gradient(180deg,rgba(255,230,160,0.15),rgba(255,255,255,0.03))]" />
                  <div className="absolute inset-[1px] rounded-[29px] shadow-[inset_0_0_60px_rgba(255,221,120,0.12)]" />
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,28,0.02),rgba(12,18,28,0.12))]" />
                </div>

                <div className="relative flex flex-1 flex-col px-4 pb-5 pt-6">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {sortedCardTags.map((tag) => {
                      const meta = getTagMeta(tag);
                      const Icon = meta.icon;

                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterTag(tag);
                          }}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                            "transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-100",
                            "shadow-none ring-0 hover:shadow-none before:hidden after:hidden",
                            meta.className
                          )}
                          style={{
                            WebkitTapHighlightColor: "transparent",
                            boxShadow: "none",
                          }}
                        >
                          <Icon className="h-3 w-3" />
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500">
                    {c.company}
                  </div>

                  <h3 className="mb-3 text-[1.85rem] font-semibold leading-[1.08] tracking-tight text-slate-900 transition-colors group-hover:text-amber-700">
                    {c.title}
                  </h3>

                  {c.description && (
                    <p className="mb-6 line-clamp-3 text-pretty text-[0.98rem] leading-relaxed text-slate-600">
                      {c.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100/90 pt-5">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive(c);
                      }}
                      className="h-11 rounded-2xl border border-slate-200 bg-white/74 px-4 text-sm font-medium text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition outline-none focus-visible:ring-2 focus-visible:ring-amber-400 hover:bg-white hover:text-slate-950"
                    >
                      Прочитать
                    </Button>

                    {c.link ? (
                      <Button
                        type="button"
                        variant="ghost"
                        asChild
                        className="h-11 rounded-2xl border border-transparent px-4 text-sm font-medium text-slate-500 transition outline-none focus-visible:ring-2 focus-visible:ring-amber-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Читать на сайте
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <div className="h-11" />
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="z-[9999] flex max-h-[92vh] w-[min(94vw,72rem)] max-w-5xl flex-col gap-0 overflow-hidden border border-white/50 bg-[rgba(255,255,255,0.96)] p-0 shadow-[0_40px_120px_rgba(0,0,0,0.24)] backdrop-blur-2xl [&>button]:hidden sm:rounded-[34px]">
          {active && (
            <>
              {/* Крестик зафиксирован в углу самой модалки */}
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute right-5 top-5 z-[50] inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/70 backdrop-blur border border-slate-200/60 text-slate-700 shadow-sm transition hover:scale-105 hover:bg-white hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>

              <DialogTitle className="sr-only">{active.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Полный обзор кейса: {active.title}
              </DialogDescription>

              <div className="relative min-h-0 flex-1 overflow-y-auto">
                {/* Обложка теперь часть прокручиваемого контента */}
                <div className="relative h-[240px] w-full sm:h-[320px] shrink-0 border-b border-slate-200/70 bg-slate-100">
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,28,0.05),rgba(12,18,28,0.16))]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
                </div>

                <div className="px-6 pb-10 pt-8 sm:px-12 sm:pb-14">
                  <div className="mx-auto max-w-3xl">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {sortTagsForCard(active.tags).map((tag) => {
                        const meta = getTagMeta(tag);
                        const Icon = meta.icon;

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => applyFilter(tag)}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
                              "transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-none hover:scale-105",
                              meta.className
                            )}
                            style={{ boxShadow: "none" }}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {tag}
                          </button>
                        );
                      })}
                    </div>

                    <h2 className="mb-10 text-[2rem] font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-[2.6rem]">
                      {active.title}
                    </h2>

                    {/* Блок информации строго сверху перед текстом */}
                    {(hasUsableDescription(active) || active.companyDescription) && (
                      <div className="mb-10 grid gap-4 md:grid-cols-[1.18fr_0.82fr]">
                        {hasUsableDescription(active) && (
                          <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,252,244,0.94),rgba(255,255,255,0.98))] p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-amber-500">
                              О проекте
                            </div>
                            <div className="mt-3 text-[1rem] leading-relaxed text-slate-600">
                              {active.description}
                            </div>
                          </div>
                        )}

                        {active.companyDescription && (
                          <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(247,250,252,0.96),rgba(255,255,255,0.99))] p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Компания
                            </div>
                            <div className="mt-3 text-[1.08rem] font-semibold text-slate-900">
                              {active.company}
                            </div>
                            <div className="mt-3 text-[0.96rem] leading-relaxed text-slate-600">
                              {active.companyDescription}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={notionProseClass}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {active.fullContent}
                      </ReactMarkdown>
                    </div>

                    {active.link && (
                      <div className="mt-12 flex justify-center border-t border-slate-100 pt-10">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="h-12 rounded-2xl border border-slate-200 bg-white px-6 text-base font-medium text-slate-700 transition outline-none focus-visible:ring-2 focus-visible:ring-amber-400 hover:bg-slate-50 hover:text-slate-950"
                          asChild
                        >
                          <a
                            href={active.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-5 w-5" />
                            {active.linkLabel ?? "Читать на сайте"}
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CasesSection;