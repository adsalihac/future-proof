"use client";

import { CSSProperties, FormEvent, useMemo, useState } from "react";

type SliderKey =
  | "repetitiveWork"
  | "creativityRequired"
  | "humanInteraction"
  | "decisionMaking"
  | "physicalPresence"
  | "toolDependence";

type Slider = {
  key: SliderKey;
  label: string;
  helper: string;
  lowLabel: string;
  highLabel: string;
};

type Scores = {
  automationRisk: number;
  futureProof: number;
  humanAdvantage: number;
  timeline: string;
  riskLevel: "Low" | "Medium" | "High" | "Very high";
  explanation: string;
  recommendations: string[];
};

const sliders: Slider[] = [
  {
    key: "repetitiveWork",
    label: "Repetitive Work",
    helper: "How often the work follows repeatable steps.",
    lowLabel: "Rare",
    highLabel: "Constant"
  },
  {
    key: "creativityRequired",
    label: "Creativity Required",
    helper: "How much original thinking, taste, or invention is needed.",
    lowLabel: "Low",
    highLabel: "High"
  },
  {
    key: "humanInteraction",
    label: "Human Interaction",
    helper: "How much trust, empathy, persuasion, or collaboration matters.",
    lowLabel: "Minimal",
    highLabel: "Deep"
  },
  {
    key: "decisionMaking",
    label: "Decision Making",
    helper: "How often the role handles judgment under ambiguity.",
    lowLabel: "Simple",
    highLabel: "Complex"
  },
  {
    key: "physicalPresence",
    label: "Physical Presence",
    helper: "How much on-site work or real-world context is required.",
    lowLabel: "None",
    highLabel: "Required"
  },
  {
    key: "toolDependence",
    label: "Tool Dependence",
    helper: "How much output is mediated by software or digital tools.",
    lowLabel: "Low",
    highLabel: "High"
  }
];

const defaults: Record<SliderKey, number> = {
  repetitiveWork: 4,
  creativityRequired: 7,
  humanInteraction: 6,
  decisionMaking: 7,
  physicalPresence: 3,
  toolDependence: 8
};

const exampleRoles = [
  "React Native Developer",
  "Accountant",
  "Designer",
  "Customer Support",
  "Teacher",
  "Data Entry Operator"
];

const rolePresets: Record<string, Record<SliderKey, number>> = {
  "React Native Developer": defaults,
  Accountant: {
    repetitiveWork: 7,
    creativityRequired: 4,
    humanInteraction: 5,
    decisionMaking: 6,
    physicalPresence: 2,
    toolDependence: 8
  },
  Designer: {
    repetitiveWork: 3,
    creativityRequired: 9,
    humanInteraction: 6,
    decisionMaking: 6,
    physicalPresence: 2,
    toolDependence: 7
  },
  "Customer Support": {
    repetitiveWork: 8,
    creativityRequired: 4,
    humanInteraction: 8,
    decisionMaking: 4,
    physicalPresence: 2,
    toolDependence: 7
  },
  Teacher: {
    repetitiveWork: 4,
    creativityRequired: 7,
    humanInteraction: 9,
    decisionMaking: 7,
    physicalPresence: 7,
    toolDependence: 4
  },
  "Data Entry Operator": {
    repetitiveWork: 10,
    creativityRequired: 2,
    humanInteraction: 2,
    decisionMaking: 2,
    physicalPresence: 1,
    toolDependence: 9
  }
};

const recommendationSets = {
  creativity: [
    "Creative problem solving",
    "Product thinking",
    "Personal branding"
  ],
  human: ["Communication", "Consulting", "Sales", "Leadership"],
  decision: ["Strategy", "Business analysis", "System design"],
  physical: [
    "Domain expertise",
    "Real-world operations",
    "Client-facing skills"
  ]
};

const rawMin = 1 * 30 + 1 * 5;
const rawMax = 10 * 30 + 9 * 20 + 9 * 20 + 9 * 15 + 9 * 10 + 10 * 5;

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getTimeline(score: number) {
  if (score <= 30) {
    return {
      timeline: "10+ years",
      riskLevel: "Low" as const,
      explanation:
        "This work has strong human defensibility and a longer automation horizon."
    };
  }

  if (score <= 60) {
    return {
      timeline: "5-10 years",
      riskLevel: "Medium" as const,
      explanation:
        "Parts of this work can be automated, but human judgment still meaningfully protects the role."
    };
  }

  if (score <= 80) {
    return {
      timeline: "2-5 years",
      riskLevel: "High" as const,
      explanation:
        "The work contains several automation-friendly patterns and should be actively repositioned."
    };
  }

  return {
    timeline: "0-2 years",
    riskLevel: "Very high" as const,
    explanation:
      "Most signals point toward rapid automation pressure unless the work shifts toward human advantage."
  };
}

function calculateScores(values: Record<SliderKey, number>): Scores {
  const rawScore =
    values.repetitiveWork * 30 +
    (10 - values.creativityRequired) * 20 +
    (10 - values.humanInteraction) * 20 +
    (10 - values.decisionMaking) * 15 +
    (10 - values.physicalPresence) * 10 +
    values.toolDependence * 5;

  const automationRisk = clampScore(((rawScore - rawMin) / (rawMax - rawMin)) * 100);
  const humanAdvantage = clampScore(
    ((values.creativityRequired +
      values.humanInteraction +
      values.decisionMaking +
      values.physicalPresence) /
      4 /
      10) *
      100
  );
  const timeline = getTimeline(automationRisk);
  const recommendations = new Set<string>();

  if (values.creativityRequired <= 5) {
    recommendationSets.creativity.forEach((item) => recommendations.add(item));
  }

  if (values.humanInteraction <= 5) {
    recommendationSets.human.forEach((item) => recommendations.add(item));
  }

  if (values.decisionMaking <= 5) {
    recommendationSets.decision.forEach((item) => recommendations.add(item));
  }

  if (values.physicalPresence <= 5) {
    recommendationSets.physical.forEach((item) => recommendations.add(item));
  }

  if (recommendations.size === 0) {
    ["Strategic storytelling", "Executive communication", "Specialized domain depth"].forEach(
      (item) => recommendations.add(item)
    );
  }

  return {
    automationRisk,
    futureProof: 100 - automationRisk,
    humanAdvantage,
    recommendations: Array.from(recommendations).slice(0, 8),
    ...timeline
  };
}

function getBadgeClasses(riskLevel: Scores["riskLevel"]) {
  switch (riskLevel) {
    case "Low":
      return "border-zinc-200 bg-white text-zinc-900";
    case "Medium":
      return "border-zinc-300 bg-zinc-100 text-zinc-900";
    case "High":
      return "border-zinc-400 bg-zinc-200 text-zinc-950";
    case "Very high":
      return "border-black bg-black text-white";
    default:
      return "border-zinc-200 bg-white text-zinc-900";
  }
}

function getRiskIndex(riskLevel: Scores["riskLevel"]) {
  return ["Low", "Medium", "High", "Very high"].indexOf(riskLevel);
}

function buildShareText(roleName: string, scores: Scores) {
  const name = roleName.trim() || "my work";

  return [
    `FutureProof Score for ${name}`,
    `Automation Risk Score: ${scores.automationRisk}/100`,
    `FutureProof Score: ${scores.futureProof}/100`,
    `Human Advantage Score: ${scores.humanAdvantage}/100`,
    `Risk Timeline: ${scores.riskLevel} risk, ${scores.timeline}`,
    `Recommended skills: ${scores.recommendations.join(", ")}`
  ].join("\n");
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

export default function Home() {
  const [roleName, setRoleName] = useState("");
  const [reportRoleName, setReportRoleName] = useState("");
  const [hasReport, setHasReport] = useState(false);
  const [inputError, setInputError] = useState("");
  const [values, setValues] = useState<Record<SliderKey, number>>(defaults);
  const [copied, setCopied] = useState(false);

  const scores = useMemo(() => calculateScores(values), [values]);
  const shareText = useMemo(
    () => buildShareText(reportRoleName, scores),
    [reportRoleName, scores]
  );

  function updateSlider(key: SliderKey, value: number) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(role: string) {
    setRoleName(role);
    setValues(rolePresets[role]);
    setHasReport(false);
    setInputError("");
    setCopied(false);
  }

  function resetCalculator() {
    setRoleName("");
    setReportRoleName("");
    setHasReport(false);
    setInputError("");
    setValues(defaults);
    setCopied(false);
  }

  async function copyResult() {
    try {
      await copyTextToClipboard(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function shareResult() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "FutureProof Score",
          text: shareText
        });
        return;
      }

      await copyResult();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        await copyResult();
      }
    }
  }

  function showCalculator() {
    document
      .getElementById("calculator")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function calculateReport(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const trimmedRole = roleName.trim();

    if (!trimmedRole) {
      setInputError("Enter a job, business, or task name first.");
      setHasReport(false);
      document.getElementById("role-name")?.focus();
      return;
    }

    setReportRoleName(trimmedRole);
    setHasReport(true);
    setInputError("");
    setCopied(false);
    showCalculator();
  }

  return (
    <main className="min-h-screen bg-white text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 font-heading text-lg font-bold tracking-normal">
            <img
              src="/logo-mark.svg"
              alt=""
              aria-hidden="true"
              className="size-9 rounded-lg"
            />
            FutureProof Score
          </div>
          <div className="hidden items-center gap-3 text-sm font-bold text-muted sm:flex">
            <span>Rule-based</span>
            <span className="h-1 w-1 rounded-full bg-zinc-300" />
            <span>No login</span>
            <span className="h-1 w-1 rounded-full bg-zinc-300" />
            <span>No AI API</span>
          </div>
        </div>
      </header>

      <section className="border-b border-line bg-white">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="w-full max-w-4xl">
            <p className="mb-5 inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-extrabold uppercase tracking-[0.14em] text-zinc-700">
              Automation risk calculator
            </p>
            <h1 className="font-heading text-5xl font-bold leading-[1.02] tracking-normal text-ink sm:text-6xl lg:text-7xl">
              Check how future-proof your work is.
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-muted">
              Enter any job, business, or task and get an instant automation risk
              score using a simple rule-based calculator.
            </p>

            <form
              onSubmit={calculateReport}
              className="mt-9 w-full max-w-4xl border border-zinc-300 bg-white p-2 shadow-card sm:flex sm:items-center sm:gap-2"
            >
              <label className="sr-only" htmlFor="role-name">
                Job, business, or task name
              </label>
              <input
                id="role-name"
                value={roleName}
                onChange={(event) => {
                  setRoleName(event.target.value);
                  setHasReport(false);
                  setInputError("");
                  setCopied(false);
                }}
                aria-invalid={Boolean(inputError)}
                aria-describedby={inputError ? "role-name-error" : undefined}
                className="h-14 w-full rounded-md border border-transparent px-4 text-base font-extrabold text-ink outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                placeholder="Job, business, or task name"
              />
              <button
                type="submit"
                className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-md bg-black px-6 text-center text-base font-extrabold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 sm:mt-0 sm:w-auto"
              >
                Calculate Score
              </button>
            </form>
            {inputError && (
              <p id="role-name-error" className="mt-3 text-sm font-bold text-zinc-700">
                {inputError}
              </p>
            )}

            <div className="mt-5 flex w-full max-w-4xl flex-wrap gap-2">
              {exampleRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => applyPreset(role)}
                  className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-extrabold text-zinc-700 transition hover:border-black hover:text-black focus:outline-none focus:ring-4 focus:ring-zinc-100"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
          <div className="border border-zinc-300 bg-white p-5 shadow-card sm:p-7">
            <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-muted">
                  Calculator inputs
                </p>
                <h2 className="mt-2 font-heading text-3xl font-bold text-ink">
                  Tune the six work signals.
                </h2>
              </div>
              <button
                type="button"
                onClick={resetCalculator}
                className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-extrabold text-zinc-800 transition hover:border-black focus:outline-none focus:ring-4 focus:ring-zinc-100"
              >
                Reset
              </button>
            </div>

            <div className="mt-7 grid gap-5">
              {sliders.map((slider) => (
                <SliderControl
                  key={slider.key}
                  slider={slider}
                  value={values[slider.key]}
                  onChange={(value) => updateSlider(slider.key, value)}
                />
              ))}
            </div>
          </div>

          {hasReport ? (
            <ResultCard
              roleName={reportRoleName}
              scores={scores}
              copied={copied}
              onCopy={copyResult}
              onShare={shareResult}
            />
          ) : (
            <ReportPlaceholder />
          )}
        </div>
      </section>
    </main>
  );
}

function ReportPlaceholder() {
  return (
    <aside className="border border-zinc-300 bg-white p-5 shadow-soft sm:p-7 lg:sticky lg:top-6 lg:self-start">
      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-muted">
        Report
      </p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-ink">
        Ready when you calculate.
      </h2>
      <p className="mt-4 text-sm leading-6 text-muted">
        Enter a job, business, or task name, adjust the sliders, then click
        Calculate Score to generate the report.
      </p>
      <div className="mt-7 border-y border-line">
        {["Automation Risk Score", "FutureProof Score", "Human Advantage Score"].map(
          (label) => (
            <div key={label} className="flex items-center justify-between border-b border-line py-5 last:border-b-0">
              <span className="text-sm font-extrabold text-muted">{label}</span>
              <span className="font-heading text-2xl font-bold text-zinc-300">--</span>
            </div>
          )
        )}
      </div>
    </aside>
  );
}

function SliderControl({
  slider,
  value,
  onChange
}: {
  slider: Slider;
  value: number;
  onChange: (value: number) => void;
}) {
  const progress = ((value - 1) / 9) * 100;

  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-5">
        <div>
          <label
            htmlFor={slider.key}
            className="block text-base font-extrabold text-ink"
          >
            {slider.label}
          </label>
          <p className="mt-1 text-sm leading-6 text-muted">{slider.helper}</p>
        </div>
        <div className="grid size-12 shrink-0 place-items-center rounded-md border border-black bg-black font-heading text-xl font-bold text-white">
          {value}
        </div>
      </div>
      <input
        id={slider.key}
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-input mt-5"
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
      />
      <div className="mt-3 flex justify-between text-xs font-extrabold uppercase tracking-[0.12em] text-zinc-400">
        <span>{slider.lowLabel}</span>
        <span>{slider.highLabel}</span>
      </div>
    </div>
  );
}

function ResultCard({
  roleName,
  scores,
  copied,
  onCopy,
  onShare
}: {
  roleName: string;
  scores: Scores;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
}) {
  return (
    <aside className="border border-black bg-white p-5 shadow-soft sm:p-7 lg:sticky lg:top-6 lg:self-start">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-muted">
            Result summary
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-ink">
            {roleName.trim() || "Your work"}
          </h2>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-sm font-extrabold ${getBadgeClasses(
            scores.riskLevel
          )}`}
        >
          {scores.riskLevel} risk
        </span>
      </div>

      <div className="mt-7 border-y border-line">
        <MetricBlock label="Automation Risk Score" value={scores.automationRisk} />
        <MetricBlock label="FutureProof Score" value={scores.futureProof} featured />
        <MetricBlock label="Human Advantage Score" value={scores.humanAdvantage} />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-extrabold text-muted">Risk Timeline</p>
          <p className="font-heading text-xl font-bold text-ink">{scores.timeline}</p>
        </div>
        <RiskScale activeIndex={getRiskIndex(scores.riskLevel)} />
        <p className="mt-4 text-sm leading-6 text-muted">{scores.explanation}</p>
      </div>

      <div className="mt-6 border-t border-line pt-6">
        <h3 className="font-heading text-xl font-bold text-ink">
          Recommended skills
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {scores.recommendations.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-zinc-300 bg-white px-3 py-2 text-sm font-extrabold text-zinc-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-extrabold text-zinc-800 transition hover:border-black focus:outline-none focus:ring-4 focus:ring-zinc-100"
        >
          {copied ? "Copied" : "Copy result"}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex h-12 items-center justify-center rounded-md bg-black px-4 text-sm font-extrabold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
        >
          Share result
        </button>
      </div>
    </aside>
  );
}

function MetricBlock({
  label,
  value,
  featured = false
}: {
  label: string;
  value: number;
  featured?: boolean;
}) {
  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <p className="text-sm font-extrabold text-muted">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p
          className={`font-heading font-bold leading-none ${
            featured ? "text-6xl text-ink" : "text-5xl text-ink"
          }`}
        >
          {value}
        </p>
        <p className="mb-1 text-sm font-extrabold text-muted">/100</p>
      </div>
      <div className="mt-4 h-2 rounded-full bg-zinc-100">
        <div
          className="h-2 rounded-full bg-black transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RiskScale({ activeIndex }: { activeIndex: number }) {
  const bands = ["Low", "Medium", "High", "Very high"];

  return (
    <div className="mt-4 grid grid-cols-4 gap-1">
      {bands.map((band, index) => (
        <div key={band}>
          <div
            className={`h-2 rounded-full ${
              index <= activeIndex ? "bg-black" : "bg-zinc-200"
            }`}
          />
          <p
            className={`mt-2 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] ${
              index === activeIndex ? "text-black" : "text-zinc-400"
            }`}
          >
            {band}
          </p>
        </div>
      ))}
    </div>
  );
}
