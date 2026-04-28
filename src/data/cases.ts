import fullContentProptech from "../../notion-data/PropTech кейс для IT компании 3045c3762c418107b2ece4cd3bc595c5.md?raw";
import fullContentArticle from "../../notion-data/Статья про PropTech для IT компании 3045c3762c4181e7874af5ec3ec68a3c.md?raw";
import fullContentEmailCombined from "../../notion-data/email-marketing-kts.md?raw";

export type PortfolioCase = {
  id: string;
  title: string;
  description?: string;
  fullContent: string;
  company: string;
  companyDescription?: string;
  tags: string[];
  image: string;
  link?: string;
  linkLabel?: string;
  status?: string;
};

export const cases: PortfolioCase[] = [
  {
    id: "proptech-legend",
    title: "PropTech кейс для IT компании",
    description:
      "Упаковка кейса внедрения для IT-компании в PropTech на примере LEGENDA. Продуктовая разработка личного кабинета брокера превращена в ясную B2B-историю с ключевыми сценариями, интеграциями и выгодами для бизнеса.",
    fullContent: fullContentProptech,
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    tags: ["IT", "PropTech", "Примеры текстов", "Упаковка кейсов"],
    image: "/images/chatgpt-cover.png",
    status: "Релиз ожидается весной",
  },
  {
    id: "article-proptech-2026",
    title: "Статья про PropTech для IT компании",
    description:
      "Аналитическая статья о PropTech-трендах 2026: как девелоперам усилить продажи, стройку и эксплуатацию через цифровые продукты и автоматизацию. Внутри — практичный список решений, которые можно запустить за 2–4 недели.",
    fullContent: fullContentArticle,
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    tags: ["IT", "PropTech", "Примеры текстов", "Статьи"],
    image: "/images/generated-image_2.png",
    link: "https://guides.kts.tech/proptech-trendy-2026/",
    linkLabel: "Читать на сайте",
  },
  {
    id: "email-marketing-kts",
    title: "Email-маркетинг для IT-компании",
    description:
      "Серия email-рассылок для прогрева тёплой базы: вход через аналитику, кейсы и мягкий вывод в диалог. Внутри собраны два письма под разные сценарии коммуникации.",
    fullContent: fullContentEmailCombined,
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    tags: ["IT", "PropTech", "Примеры текстов", "Тексты рассылок", "Email"],
    image: "/images/generated-image_4.png",
    status: "Два примера писем внутри кейса",
  },
];