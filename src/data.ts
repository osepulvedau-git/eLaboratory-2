export interface DataPoint {
  date: string;
  sp500: number;
  jobs: number;
}

export interface MarkerEvent {
  id: string;
  type: 'red' | 'green';
  title: string;
  originalLabel: string;
  date: string; // matches date in data
  xMonthIndex: number; // 0 to 117
  yVal: number; // Y-value in the graph units (0 - 350)
  arrowDir: 'up' | 'down';
  yOffset: number; // pixel offset to position the box away from the chart lines
  description: string;
  extendedAnalysis: string;
  keyTakeaway: string;
  reflectionQuestion: string;
}

// Monthly data points from June 2016 (index 0) to March 2026 (index 117)
// Generated to accurately fit the curves in both slides
export const CHART_DATA: DataPoint[] = [
  { date: "Jun-16", sp500: 100.0, jobs: 100.0 },
  { date: "Jul-16", sp500: 103.5, jobs: 101.2 },
  { date: "Aug-16", sp500: 102.8, jobs: 100.8 },
  { date: "Sep-16", sp500: 105.1, jobs: 98.4 },
  { date: "Oct-16", sp500: 104.2, jobs: 103.1 },
  { date: "Nov-16", sp500: 106.0, jobs: 102.0 },
  { date: "Dec-16", sp500: 105.5, jobs: 104.5 },
  { date: "Jan-17", sp500: 109.2, jobs: 99.1 },
  { date: "Feb-17", sp500: 111.4, jobs: 101.5 },
  { date: "Mar-17", sp500: 114.1, jobs: 103.2 },
  { date: "Apr-17", sp500: 113.8, jobs: 107.4 },
  { date: "May-17", sp500: 115.3, jobs: 103.0 },
  { date: "Jun-17", sp500: 118.0, jobs: 109.8 },
  { date: "Jul-17", sp500: 119.2, jobs: 110.1 },
  { date: "Aug-17", sp500: 119.1, jobs: 108.5 },
  { date: "Sep-17", sp500: 121.5, jobs: 110.6 },
  { date: "Oct-17", sp500: 123.8, jobs: 110.2 },
  { date: "Nov-17", sp500: 127.1, jobs: 111.8 },
  { date: "Dec-17", sp500: 134.3, jobs: 117.2 },
  { date: "Jan-18", sp500: 131.0, jobs: 114.5 },
  { date: "Feb-18", sp500: 129.5, jobs: 118.0 },
  { date: "Mar-18", sp500: 131.2, jobs: 120.9 },
  { date: "Apr-18", sp500: 128.4, jobs: 122.8 },
  { date: "May-18", sp500: 131.8, jobs: 125.1 },
  { date: "Jun-18", sp500: 134.0, jobs: 127.3 },
  { date: "Jul-18", sp500: 136.1, jobs: 127.5 },
  { date: "Aug-18", sp500: 140.2, jobs: 129.2 },
  { date: "Sep-18", sp500: 141.0, jobs: 130.4 },
  { date: "Oct-18", sp500: 135.5, jobs: 128.1 },
  { date: "Nov-18", sp500: 128.2, jobs: 131.3 },
  { date: "Dec-18", sp500: 124.1, jobs: 132.0 },
  { date: "Jan-19", sp500: 131.5, jobs: 127.8 },
  { date: "Feb-19", sp500: 135.4, jobs: 128.4 },
  { date: "Mar-19", sp500: 140.2, jobs: 127.9 },
  { date: "Apr-19", sp500: 138.5, jobs: 126.1 },
  { date: "May-19", sp500: 144.1, jobs: 124.2 },
  { date: "Jun-19", sp500: 140.2, jobs: 125.8 },
  { date: "Jul-19", sp500: 144.9, jobs: 124.1 },
  { date: "Aug-19", sp500: 146.2, jobs: 126.3 },
  { date: "Sep-19", sp500: 151.1, jobs: 124.1 },
  { date: "Oct-19", sp500: 153.2, jobs: 127.8 },
  { date: "Nov-19", sp500: 156.4, jobs: 121.3 },
  { date: "Dec-19", sp500: 156.8, jobs: 125.5 },
  { date: "Jan-20", sp500: 142.1, jobs: 121.2 },
  { date: "Feb-20", sp500: 129.2, jobs: 118.1 },
  { date: "Mar-20", sp500: 135.3, jobs: 104.9 },
  { date: "Apr-20", sp500: 142.2, jobs: 81.3 },
  { date: "May-20", sp500: 149.5, jobs: 99.8 },
  { date: "Jun-20", sp500: 154.2, jobs: 108.5 },
  { date: "Jul-20", sp500: 162.0, jobs: 114.1 },
  { date: "Aug-20", sp500: 161.1, jobs: 113.2 },
  { date: "Sep-20", sp500: 165.4, jobs: 115.8 },
  { date: "Oct-20", sp500: 169.2, jobs: 119.5 },
  { date: "Nov-20", sp500: 174.1, jobs: 118.8 },
  { date: "Dec-20", sp500: 179.8, jobs: 119.2 },
  { date: "Jan-21", sp500: 184.2, jobs: 129.1 },
  { date: "Feb-21", sp500: 186.4, jobs: 139.8 },
  { date: "Mar-21", sp500: 191.2, jobs: 148.5 },
  { date: "Apr-21", sp500: 198.5, jobs: 159.2 },
  { date: "May-21", sp500: 199.1, jobs: 168.1 },
  { date: "Jun-21", sp500: 205.2, jobs: 180.2 },
  { date: "Jul-21", sp500: 213.1, jobs: 190.5 },
  { date: "Aug-21", sp500: 213.2, jobs: 187.1 },
  { date: "Sep-21", sp500: 213.4, jobs: 189.2 },
  { date: "Oct-21", sp500: 219.1, jobs: 195.2 },
  { date: "Nov-21", sp500: 225.1, jobs: 194.1 },
  { date: "Dec-21", sp500: 224.2, jobs: 198.5 },
  { date: "Jan-22", sp500: 218.4, jobs: 194.5 },
  { date: "Feb-22", sp500: 211.2, jobs: 204.1 },
  { date: "Mar-22", sp500: 210.8, jobs: 213.2 },
  { date: "Apr-22", sp500: 198.2, jobs: 204.5 },
  { date: "May-22", sp500: 191.1, jobs: 200.1 },
  { date: "Jun-22", sp500: 186.2, jobs: 192.3 },
  { date: "Jul-22", sp500: 186.4, jobs: 198.5 },
  { date: "Aug-22", sp500: 186.2, jobs: 178.1 },
  { date: "Sep-22", sp500: 174.1, jobs: 201.2 },
  { date: "Oct-22", sp500: 182.2, jobs: 182.1 },
  { date: "Nov-22", sp500: 186.4, jobs: 181.1 },
  { date: "Dec-22", sp500: 188.1, jobs: 184.2 }, // artificial flag to identify ChatGPT launch
  { date: "Jan-23", sp500: 190.5, jobs: 178.5 },
  { date: "Feb-23", sp500: 195.2, jobs: 172.1 },
  { date: "Mar-23", sp500: 191.2, jobs: 166.5 },
  { date: "Apr-23", sp500: 196.4, jobs: 171.2 },
  { date: "May-23", sp500: 197.8, jobs: 162.1 },
  { date: "Jun-23", sp500: 205.1, jobs: 150.2 },
  { date: "Jul-23", sp500: 212.1, jobs: 161.2 },
  { date: "Aug-23", sp500: 211.5, jobs: 160.5 },
  { date: "Sep-23", sp500: 209.2, jobs: 149.2 },
  { date: "Oct-23", sp500: 204.1, jobs: 148.5 },
  { date: "Nov-23", sp500: 215.1, jobs: 147.2 },
  { date: "Dec-23", sp500: 222.1, jobs: 145.2 },
  { date: "Jan-24", sp500: 226.4, jobs: 146.1 },
  { date: "Feb-24", sp500: 234.1, jobs: 144.1 },
  { date: "Mar-24", sp500: 242.0, jobs: 143.5 },
  { date: "Apr-24", sp500: 248.5, jobs: 132.8 },
  { date: "May-24", sp500: 246.1, jobs: 136.2 },
  { date: "Jun-24", sp500: 254.2, jobs: 132.1 },
  { date: "Jul-24", sp500: 260.1, jobs: 130.4 },
  { date: "Aug-24", sp500: 267.3, jobs: 131.2 },
  { date: "Sep-24", sp500: 265.2, jobs: 131.1 },
  { date: "Oct-24", sp500: 274.5, jobs: 122.5 },
  { date: "Nov-24", sp500: 281.2, jobs: 132.4 },
  { date: "Dec-24", sp500: 287.5, jobs: 130.2 },
  { date: "Jan-25", sp500: 289.1, jobs: 127.8 },
  { date: "Feb-25", sp500: 290.5, jobs: 129.2 },
  { date: "Mar-25", sp500: 274.1, jobs: 122.1 },
  { date: "Apr-25", sp500: 258.1, jobs: 125.1 },
  { date: "May-25", sp500: 275.2, jobs: 127.2 },
  { date: "Jun-25", sp500: 286.1, jobs: 125.2 },
  { date: "Jul-25", sp500: 298.5, jobs: 126.3 },
  { date: "Aug-25", sp500: 308.2, jobs: 123.1 },
  { date: "Sep-25", sp500: 312.4, jobs: 126.2 },
  { date: "Oct-25", sp500: 322.0, jobs: 125.8 },
  { date: "Nov-25", sp500: 325.1, jobs: 120.1 },
  { date: "Dec-25", sp500: 332.1, jobs: 127.2 },
  { date: "Jan-26", sp500: 332.5, jobs: 122.1 },
  { date: "Feb-26", sp500: 328.0, jobs: 120.2 },
  { date: "Mar-26", sp500: 319.0, jobs: 120.0 }
];

export const EVENTS: MarkerEvent[] = [
  // RED HEADWINDS / CRISES
  {
    id: "brexit",
    type: "red",
    title: "China Slowdown & Brexit Shock",
    originalLabel: "China Slowdown, Brexit",
    date: "Sep-16",
    xMonthIndex: 3,
    yVal: 105.1,
    arrowDir: "down",
    yOffset: -120,
    description: "In mid-to-late 2016, global market stability faced two simultaneous shocks: the UK's unexpected democratic vote to leave the European Union (Brexit), and deep industrial contraction combined with debt anxieties in China.",
    extendedAnalysis: "While Brexit triggered immense regulatory currency fluctuations and raised European disintegration risks, China's shadow banking clampdowns cooled global resource demand. Despite these macro-anxieties, US employment growth remained firmly resilient, and S&P500 indices recovered rapidly as central banks stepped in with prompt assurances.",
    keyTakeaway: "Early-stage geopolitical panic often induces short-term equity repricing without disrupting structural workforce growth.",
    reflectionQuestion: "Why did stock indices bounce back so quickly after Brexit compared to internal real-economy job hiring rates?"
  },
  {
    id: "trade-war",
    type: "red",
    title: "U.S. - China Trade War Escalation",
    originalLabel: "U.S.-China trade war",
    date: "Sep-18",
    xMonthIndex: 27,
    yVal: 141.0,
    arrowDir: "down",
    yOffset: -80,
    description: "The imposition of tit-for-tat tariffs on over $350 billion of trade volume between the world's two largest economies triggered intense supply chain disruption, inflation fears, and business planning freezes.",
    extendedAnalysis: "During 2018, the S&P 500 suffered multiple corrections as trade tensions heightened, culminating in a severe drop in December 2018. Industrial firms held back capital expenditures; however, domestic services hiring stayed strong, keeping the New Jobs index trending upwards and highlighting a decoupling where domestic job markets outgrew multinational financial panic.",
    keyTakeaway: "Trade tariffs represent a tax on corporate margins, causing sharp stock market volatility even when domestic consumer demand and hiring persist.",
    reflectionQuestion: "If tariffs primarily make physical imports more expensive, why did service-sector job numbers remain unaffected in late 2018?"
  },
  {
    id: "covid-red",
    type: "red",
    title: "COVID-19 Financial & Economic Halt",
    originalLabel: "Covid",
    date: "Mar-20",
    xMonthIndex: 45,
    yVal: 135.3,
    arrowDir: "down",
    yOffset: -70,
    description: "The sudden rapid globe-spanning outbreak of SARS-CoV-2 forced governments into instant wartime quarantine lockdowns of physical retail, hospitality, travel, and non-essential operations.",
    extendedAnalysis: "This trigger generated the fastest equity market crash in financial history starting in mid-February 2020. Over 20 million American workers lost their jobs within a single month of lockdowns, marking this as the single most devastating physical labor shock since the Great Depression.",
    keyTakeaway: "A physical disruption to physical contact represents the ultimate challenge for labor-intensive, person-to-person economic models.",
    reflectionQuestion: "How did the unprecedented speed of the 2020 crash influence the monetary actions taken by the US Federal Reserve?"
  },
  {
    id: "russia-ukraine",
    type: "red",
    title: "Russia - Ukraine Invasion & Energy Shock",
    originalLabel: "Russia - Ukraine Invasion",
    date: "Mar-22",
    xMonthIndex: 69,
    yVal: 210.8,
    arrowDir: "down",
    yOffset: -90,
    description: "The onset of full-scale war on the frontiers of Europe closed localized grain exports and provoked severe Western energy sanctions on Russian oil and gas, sending food and energy commodity prices to historic highs.",
    extendedAnalysis: "The resulting inflation spike forced the Federal Reserve and global central banks to end a decade-long era of near-zero interest rates. Financial markets entered a deep correction throughout 2022 as higher cost of capital squeezed stock valuation multiples, while the labor market remained historically tight as firms held onto high-cost talent.",
    keyTakeaway: "Geopolitical commodity spikes trigger structural inflation, shifting the Federal Reserve's priority from supporting growth to aggressively cooling the aggregate demand.",
    reflectionQuestion: "Why did a sharp stock market correction in 2022 not immediately translate to massive layoffs during that calendar year?"
  },
  {
    id: "banking-stress",
    type: "red",
    title: "US Regional Banking Crisis",
    originalLabel: "US Regional Banking Stress",
    date: "Mar-23",
    xMonthIndex: 81,
    yVal: 191.2,
    arrowDir: "down",
    yOffset: -120,
    description: "Sustained Fed rate hikes eroded the underlying value of long-term Treasury bonds held by regional banks. When depositors panic-withdrew capital, Silicon Valley Bank, Signature Bank, and First Republic collapsed in rapid succession.",
    extendedAnalysis: "This represented the largest bank failures since the 2008 Financial Crisis. The S&P500 dropped heavily in March 2023 on systemic banking contagion fears. Instant liquidity support from the Fed via the BTFP backstopped depositors and stabilized trust, preventing a system-wide credit crunch that would have devastated general payroll financing.",
    keyTakeaway: "Unprecedented interest rate rises expose hidden liquidity imbalances in financial institutions, requiring rapid state intervention to safeguard the real economy's credit supply.",
    reflectionQuestion: "What is the relationship between bank liquidity and a small business's capacity to access capital for monthly payroll and staff expansion?"
  },
  {
    id: "chatgpt-red",
    type: "red",
    title: "ChatGPT Launch: The White-Collar Labor Headwind",
    originalLabel: "Chat GPT",
    date: "Nov-22",
    xMonthIndex: 77,
    yVal: 186.4,
    arrowDir: "down",
    yOffset: -65,
    description: "The public release of OpenAI's ChatGPT democratized access to highly capable Large Language Models, illustrating that cognitive, generative task automation had reached commercial production quality.",
    extendedAnalysis: "Though celebrated by equity markets, this event marked a profound shift for white-collar talent acquisition. Over the following months, corporations initialized hiring freezes and reorganizations across customer service, entry-level software programming, and copywriting departments, directly starting a long-term structural downward drift in entry-level and traditional contract job openings.",
    keyTakeaway: "High-capability cognitive AI introduces permanent labor efficiency enhancements, allowing enterprise revenue to grow while reducing traditional administrative headcounts.",
    reflectionQuestion: "Why does an automation milestone like ChatGPT act as a bullish tailwind for stock indices but a contraction vector for entry-level job indices?"
  },
  {
    id: "israel-iran-2025",
    type: "red",
    title: "Israel - Iran Direct Military Confrontation",
    originalLabel: "Israel - Iran War",
    date: "Mar-25",
    xMonthIndex: 105,
    yVal: 274.1,
    arrowDir: "down",
    yOffset: -50,
    description: "Direct drone, missile, and cyber exchanges between regional powers raised global anxieties about maritime trade checkpoints and oil shipping infrastructure in the Strait of Hormuz.",
    extendedAnalysis: "Financial markets experienced temporary equity drops as risk premiums increased. Geopolitical threat levels forced strategic defense capital restructuring. However, global energy supply networks proved more resilient than feared, and markets quickly pivoted attention back to generative AI secular growth trajectories.",
    keyTakeaway: "Localized geographic conflicts create sharp but temporary volatility spikes unless they successfully block major global shipping choke-points.",
    reflectionQuestion: "Given the potential disruption, what buffers in global trade routes prevented this crisis from sparking a full-scale 1970s-style global oil embargo?"
  },
  {
    id: "conflict-2026",
    type: "red",
    title: "Escalated Multi-Theater Red Sea & Regional Risks",
    originalLabel: "US - Israel - Iran War",
    date: "Mar-26",
    xMonthIndex: 117,
    yVal: 319.0,
    arrowDir: "down",
    yOffset: -125,
    description: "Prolonged military deployments and direct engagements involving regional allies created shipping backlogs and high maritime transport container costs.",
    extendedAnalysis: "This ongoing friction kept transportation insurance costs elevated at the start of 2026, creating structural limits for physical logistics. This friction stood in stark contrast to the frictionless weightless expansion of the AI digital economy, reinforcing the persistent market favorability towards localized software and AI versus hardware-heavy supply chain operations.",
    keyTakeaway: "Physical supply chain vulnerabilities insulate pure-play digital asset indices from regional geopolitical conflict shocks.",
    reflectionQuestion: "How do persistent regional shipping friction costs affect corporate decisions between physical near-shoring versus virtual talent outsourcing?"
  },

  // GREEN DRIVERS / TRANSITIONS
  {
    id: "covid-green",
    type: "green",
    title: "COVID-19 Tech & Digital Replatforming",
    originalLabel: "Covid",
    date: "Jun-20",
    xMonthIndex: 48,
    yVal: 108.5,
    arrowDir: "up",
    yOffset: 30,
    description: "The COVID-19 pandemic accelerated a decade of digital transformation into a single quarter. Lockdowns forced organizations to migrate fully to Cloud-based infrastructure, digital payments, and Zoom-driven remote collaboration.",
    extendedAnalysis: "To counteract the lockdown slump, the US Federal Reserve injected trillions of dollars in liquidity and slashed rates to zero, while the Treasury sent direct stimulus payments. This unprecedented sea of liquidity flooded directly into asset markets, sparking an explosive rebound in tech stock valuations and enabling online platforms to recruit digital talent at a record pace.",
    keyTakeaway: "Crisis-driven technology adoption combined with ultra-loose monetary stimulus creates perfect environments for rapid tech asset value inflation.",
    reflectionQuestion: "Which factors did more to fuel the post-lockdown market surge: real corporate productivity gains or central bank monetary printing?"
  },
  {
    id: "bottleneck-green",
    type: "green",
    title: "Global Logistic & Labor Demand Bottlenecks",
    originalLabel: "Global Logistic Bottleneck",
    date: "Dec-21",
    xMonthIndex: 66,
    yVal: 198.5,
    arrowDir: "up",
    yOffset: 25,
    description: "As world economies reopened simultaneously, consumer demand outstripped physical global shipping channel capacity, triggering massive shortages of parts, microchips, and freight space.",
    extendedAnalysis: "Fearing depleted inventory, corporations engaged in 'double-ordering' and an unprecedented hiring spree across logistics, fulfillment, warehousing, and supply-chain administration. This push drove the New Jobs index to historic heights, establishing a highly competitive 'war for talent' where employers raised frontline wages extensively to secure staff.",
    keyTakeaway: "Supply chain gridlock forces massive capital allocation into redundant hiring and local capacity building, giving physical workers immense localized wage leverage.",
    reflectionQuestion: "How did the transition from 'Just-in-Time' inventory management to 'Just-in-Case' storage affect operational costs and headcounts across 2021-2022?"
  },
  {
    id: "llm-impact",
    type: "green",
    title: "LLMs Reshape Enterprise Operations",
    originalLabel: "LLM impacting coding, customer services",
    date: "Jun-23",
    xMonthIndex: 84,
    yVal: 205.1,
    arrowDir: "up",
    yOffset: 35,
    description: "Large Language Models entered mainstream software platforms. Mid-2023 saw software companies introduce Copilots and automated conversational agents at scale into operations.",
    extendedAnalysis: "Enterprise leaders realized GPT-4 class models could perform programming, high-volume customer interaction, and basic content curation with massive speedups. While software stocks and the S&P 500 decoupled and soared on expectations of massive margin expansions, companies rationalized customer support and basic engineering headcounts, turning human labor into a secondary focus.",
    keyTakeaway: "Software-based automation shifts corporate margins from labor-derived costs to platform-derived high-margin software licenses.",
    reflectionQuestion: "In a world where software creates itself and automates standard service tasks, what specific skillsets remain highly valued for human corporate workers?"
  },
  {
    id: "ai-acceleration",
    type: "green",
    title: "Secular AI-CapEx & Hardware Infrastructure Surge",
    originalLabel: "AI - Automation Acceleration",
    date: "Jan-24",
    xMonthIndex: 91,
    yVal: 226.4,
    arrowDir: "up",
    yOffset: 45,
    description: "Deep tech capital expenditure skyrocketed as hyperscalers, governments, and financial institution giants raced to purchase massive quantities of high-performance AI GPUs and design proprietary silicon.",
    extendedAnalysis: "Nvidia, Microsoft, and energy-infrastructure companies led a massive S&P 500 rally. AI hardware was prioritized over traditional investments. To fund these massive tech budgets, chief financial officers trimmed traditional headcounts across standard marketing and product support, contributing to the persistent cooling of the general hiring market.",
    keyTakeaway: "Capital budgets in the mid-2020s shifted dramatically from traditional payroll expansion into advanced computing hardware and power generation infrastructure.",
    reflectionQuestion: "Why does concentrated spending on supercomputers create fewer local middle-class jobs than building physical offices or factories would?"
  },
  {
    id: "policy-worry",
    type: "green",
    title: "Policy Shifts & White-Collar Labor Displacement Dialogues",
    originalLabel: "Policymakers worrier about white collars",
    date: "Sep-24",
    xMonthIndex: 99,
    yVal: 265.2,
    arrowDir: "up",
    yOffset: 50,
    description: "As generative AI displaced administrative staff, congressional committees, international agencies, and taskforces pivoted from physical robotics concerns to white-collar desk-work vulnerability.",
    extendedAnalysis: "National labor reports highlighted that the speed of automation in text, writing, contract analysis, and corporate planning was outpacing regulatory guidelines. While the market rewarded these corporate efficiency gains with record-high stock indices, governments struggled with tax revenue projections as traditional highly-compensated professional jobs shifted to capital systems.",
    keyTakeaway: "Cognitive automated systems shift income distribution from white-collar payrolls into concentrated capital ownership, attracting deep regulatory and taxation debates.",
    reflectionQuestion: "How should public job-retraining and educational frameworks adapt when cognitive work is automated faster than manual blue-collar work?"
  },
  {
    id: "cognitive-automation",
    type: "green",
    title: "The Industrialization of Generative Desk Tasks",
    originalLabel: "Writing, Analysy, support, documetn review, file handling, task completion, Legal, Sales",
    date: "Sep-25",
    xMonthIndex: 111,
    yVal: 312.4,
    arrowDir: "down", // in image, it has a green box but with a downward pointing massive green arrow! This represents automation eating jobs
    yOffset: 40,
    description: "By late 2025, Generative AI advanced from narrow assistant roles to full agentic systems handling complex, multi-step knowledge workflows.",
    extendedAnalysis: "This maturity hit prime corporate operational areas: drafting complex legal documents, evaluating insurance claims, structuring financial reports, organizing medical files, and answering consumer queries. The S&P 500 broke records as software firms operated with unprecedented profit margins, whilst standard job postings for basic research, inside sales representatives, and analytical desk roles contracted drastically.",
    keyTakeaway: "The 'industrialization' of computer-bound tasks means cognitive labor is now treated as software that scale up at near-zero marginal cost.",
    reflectionQuestion: "How does the ability of an AI agent to execute a 10-step legal review in 30 seconds redefine the structure of entry-level legal apprenticeship?"
  },
  {
    id: "future-of-work",
    type: "green",
    title: "Restructured Fractional Frameworks / Labor Autonomy Reports",
    originalLabel: "Reports about reshaping the future of work",
    date: "Dec-25",
    xMonthIndex: 114,
    yVal: 332.1,
    arrowDir: "up",
    yOffset: 55,
    description: "Comprehensive national economic summaries published in early 2026 revealed a structural mutation in labor mercados: the traditional 9-to-5 job is increasingly replaced by micro-entrepreneurship and fractional AI auditing.",
    extendedAnalysis: "Rather than massive long-term unemployment, workforce data showed humans acting as independent conductors managing digital workflows. These reports documented that elite employees produce 10x output by utilizing AI agents, causing old hiring models to shrink. This keeps the traditional corporate 'New Jobs' index low, though productivity and equity markets operate at record heights.",
    keyTakeaway: "Traditional payroll trends fail to capture the rise of autonomous and fractional AI-augmented sole proprietorships.",
    reflectionQuestion: "If humans become orchestrators rather than executors, what changes must occur in healthcare, retirement, and social safety nets?"
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Before 2020, how did the S&P 500 and the New Jobs index interact?",
    options: [
      "They were heavily decoupled, moving in opposite directions.",
      "They were tightly paired, generally trending upward together.",
      "New Jobs grew at triple the speed of the S&P 500.",
      "There was no correlation at all."
    ],
    correctIndex: 1,
    explanation: "Between 2016 and 2019, the S&P 500 and New Jobs tracked each other closely, reflecting standard economic expansions where financial market growth aligned with job creation."
  },
  {
    id: 2,
    question: "What macro-monetary event caused the extreme decoupling immediately following the Covid-19 crash in early 2020?",
    options: [
      "A sudden decline in consumer internet usage.",
      "Trillions of dollars in monetary stimulus and zero-rate policies driving stock valuations while physical employment collapsed due to lockdowns.",
      "An immediate global return to in-person manufacturing.",
      "A complete ban on remote work software."
    ],
    correctIndex: 1,
    explanation: "During COVID-19, stock indices (S&P 500) surged because of immense liquidity injection, low interest rates, and high tech valuations, while the actual job market experienced a severe, structural physical lockdown shock."
  },
  {
    id: 3,
    question: "Why does the 'ChatGPT' launch and related AI advancements point downwards towards traditional job hiring while keeping stock indices high?",
    options: [
      "AI makes computers consume too much power and causes office blackouts.",
      "Generative AI increases enterprise profit margins and efficiency, which delights investors, but simultaneously reduces the demand for standard entry-level white-collar hiring.",
      "Employees refused to work at firms that utilize AI.",
      "Governments completely banned hiring software."
    ],
    correctIndex: 1,
    explanation: "AI allows companies to grow their revenues and improve efficiency without needing to scale up their headcounts linearly. This boosts S&P500 valuations (corporate earnings) while letting traditional 'New Jobs' decline."
  }
];
