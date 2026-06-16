import { useState } from "react";
import {
  AI_MODELS, PERSONA_TYPES, RESPONSE_LENGTHS,
  buildPrompt,
  type AIModel, type PersonaType, type ResponseLength,
} from "@/lib/prompt-templates";
import { Copy, CheckCheck, Zap, Bot, Code2, Palette, ShieldAlert, Skull, Clock } from "lucide-react";

const PERSONA_ICONS: Record<string, React.ElementType> = {
  hacker:        Code2,
  programmer:    Code2,
  designer:      Palette,
  cybersecurity: ShieldAlert,
  villain:       Skull,
};

function SelectionCard({
  label,
  sublabel,
  selected,
  onClick,
  color,
  icon: Icon,
  size = "md",
}: {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
  color: "green" | "purple" | "cyan";
  icon?: React.ElementType;
  size?: "sm" | "md";
}) {
  const colorMap = {
    green: {
      border: selected ? "border-green-400/80" : "border-green-500/20 hover:border-green-400/50",
      bg:     selected ? "bg-green-500/15" : "bg-green-500/5 hover:bg-green-500/10",
      glow:   selected ? "shadow-[0_0_18px_rgba(34,197,94,0.3),inset_0_0_12px_rgba(34,197,94,0.06)]" : "",
      text:   selected ? "text-green-300" : "text-green-400/70",
      dot:    "bg-green-400",
      ring:   selected ? "ring-2 ring-green-500/30" : "",
    },
    purple: {
      border: selected ? "border-purple-400/80" : "border-purple-500/20 hover:border-purple-400/50",
      bg:     selected ? "bg-purple-500/15" : "bg-purple-500/5 hover:bg-purple-500/10",
      glow:   selected ? "shadow-[0_0_18px_rgba(139,92,246,0.3),inset_0_0_12px_rgba(139,92,246,0.06)]" : "",
      text:   selected ? "text-purple-300" : "text-purple-400/70",
      dot:    "bg-purple-400",
      ring:   selected ? "ring-2 ring-purple-500/30" : "",
    },
    cyan: {
      border: selected ? "border-cyan-400/80" : "border-cyan-500/20 hover:border-cyan-400/50",
      bg:     selected ? "bg-cyan-500/15" : "bg-cyan-500/5 hover:bg-cyan-500/10",
      glow:   selected ? "shadow-[0_0_18px_rgba(6,182,212,0.3),inset_0_0_12px_rgba(6,182,212,0.06)]" : "",
      text:   selected ? "text-cyan-300" : "text-cyan-400/70",
      dot:    "bg-cyan-400",
      ring:   selected ? "ring-2 ring-cyan-500/30" : "",
    },
  };
  const c = colorMap[color];
  const pad = size === "sm" ? "py-2.5 px-3" : "py-3 px-4";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border ${c.border} ${c.bg} ${c.glow} ${c.ring}
        ${pad} flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-200
        select-none w-full group`}
    >
      {selected && (
        <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${c.dot} shadow-[0_0_6px_currentColor]`} />
      )}
      {Icon && (
        <Icon className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"} ${c.text} transition-colors`} />
      )}
      <span className={`font-bold ${size === "sm" ? "text-xs" : "text-sm"} text-white/90 transition-colors`}>
        {label}
      </span>
      {sublabel && (
        <span className={`text-[10px] ${c.text} font-mono`}>{sublabel}</span>
      )}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
      <span className="text-xs font-bold tracking-[0.2em] text-green-400/70 uppercase shrink-0">
        {children}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </div>
  );
}

export default function PromptBuilder() {
  const [selectedModel,   setSelectedModel]   = useState<AIModel | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [selectedLength,  setSelectedLength]  = useState<ResponseLength | null>(null);
  const [output,  setOutput]  = useState("");
  const [copied,  setCopied]  = useState(false);
  const [loading, setLoading] = useState(false);

  const canGenerate = selectedModel && selectedPersona && selectedLength;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const prompt = buildPrompt(selectedModel, selectedPersona, selectedLength);
    setOutput(prompt);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="rtl" className="min-h-screen cyber-bg relative overflow-x-hidden">
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Top glow bar */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/60 to-transparent z-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-green-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flicker">
              <span className="text-green-400">منشئ</span>
              {" "}
              <span className="text-purple-400">البرومبت</span>
            </h1>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-white/40 font-mono tracking-wider">
            AI PROMPT GENERATOR — اختر وأنشئ
          </p>
        </div>

        {/* SECTION 1: AI Model */}
        <div>
          <SectionLabel>اختر نموذج الذكاء الاصطناعي</SectionLabel>
          <div className="grid grid-cols-5 gap-3">
            {AI_MODELS.map((m, i) => (
              <SelectionCard
                key={m.id}
                label={m.label}
                selected={selectedModel === m.id}
                onClick={() => setSelectedModel(m.id)}
                color={i % 2 === 0 ? "green" : "purple"}
                icon={Bot}
              />
            ))}
          </div>
        </div>

        {/* SECTION 2: Persona Type */}
        <div>
          <SectionLabel>نوع البرومبت</SectionLabel>
          <div className="grid grid-cols-5 gap-3">
            {PERSONA_TYPES.map((p, i) => {
              const Icon = PERSONA_ICONS[p.id] ?? Zap;
              return (
                <SelectionCard
                  key={p.id}
                  label={p.label}
                  sublabel={p.desc}
                  selected={selectedPersona === p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  color={i % 2 === 0 ? "purple" : "green"}
                  icon={Icon}
                />
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Response Length */}
        <div>
          <SectionLabel>طول الرد</SectionLabel>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {RESPONSE_LENGTHS.map((l) => (
              <SelectionCard
                key={l.id}
                label={l.label}
                sublabel={l.desc}
                selected={selectedLength === l.id}
                onClick={() => setSelectedLength(l.id)}
                color="cyan"
                icon={Clock}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* SECTION 4: Generate Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className={`btn-generate relative px-10 py-3.5 rounded-xl text-base font-black tracking-widest uppercase
              disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
              ${canGenerate && !loading ? "pulse-active" : ""}`}
            data-testid="button-generate"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                جاري التوليد...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                توليد البرومبت
              </span>
            )}
          </button>
        </div>

        {/* Requirement reminder */}
        {!canGenerate && !output && (
          <p className="text-center text-xs text-white/25 font-mono tracking-wider">
            اختر نموذج الذكاء الاصطناعي + نوع البرومبت + طول الرد للبدء
          </p>
        )}

        {/* SECTION 5: Output */}
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.15em] text-green-400/60 uppercase">
                البرومبت الناتج
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-white/25">
                  {output.length.toLocaleString("ar")} حرف
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                    transition-all duration-200 border
                    ${copied
                      ? "bg-green-500/20 border-green-400/50 text-green-300"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90 hover:border-white/20"
                    }`}
                  data-testid="button-copy"
                >
                  {copied
                    ? <><CheckCheck className="w-3.5 h-3.5" /> تم النسخ</>
                    : <><Copy className="w-3.5 h-3.5" /> نسخ</>
                  }
                </button>
              </div>
            </div>

            <div className="output-box rounded-xl p-5 relative overflow-hidden">
              {/* Corner accents */}
              <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500/40 rounded-tr-xl" />
              <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/40 rounded-tl-xl" />
              <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/40 rounded-br-xl" />
              <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500/40 rounded-bl-xl" />

              <pre
                dir="ltr"
                className="font-mono text-[12.5px] leading-[1.85] text-white/80 whitespace-pre-wrap break-words overflow-y-auto max-h-[420px]"
                data-testid="text-prompt-output"
              >
                {output.split("\n").map((line, i) => {
                  const isHeader = line.startsWith("# ");
                  const isBold   = line.startsWith("**") && line.endsWith("**");
                  const isList   = line.startsWith("- ") || line.startsWith("> ");
                  return (
                    <span key={i} className={`block ${
                      isHeader ? "text-green-400 font-bold text-sm mt-4 mb-1 first:mt-0" :
                      isBold   ? "text-purple-300 font-semibold mt-2" :
                      isList   ? "text-white/60 pl-2" :
                      line.trim() === "" ? "h-2" :
                      "text-white/80"
                    }`}>
                      {line || ""}
                    </span>
                  );
                })}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-xs font-mono text-white/15 tracking-widest">
            AI PROMPT BUILDER — FOR PROFESSIONALS
          </p>
        </div>
      </div>
    </div>
  );
}
