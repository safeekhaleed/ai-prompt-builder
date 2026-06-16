import { PromptFormValues } from "./schema";

export function generatePrompt(data: PromptFormValues): string {
  const parts: string[] = [];

  // 1. Identity
  if (data.name) {
    parts.push(`You are ${data.name}.`);
  }
  if (data.role) {
    parts.push(`Role: ${data.role}`);
  }
  if (data.personality) {
    parts.push(`\n# PERSONALITY\n${data.personality}`);
  }
  if (data.speakingStyle) {
    parts.push(`\n# SPEAKING STYLE\n${data.speakingStyle}`);
    if (data.pov) {
      parts.push(`POV: ${data.pov}`);
    }
  }

  // 2. Format
  const formatRules = [];
  if (data.maxLength && data.maxLength !== "No limit") {
    formatRules.push(`- Keep responses ${data.maxLength.toLowerCase()}.`);
  }
  if (data.codeDetail) {
    formatRules.push(`- Code detail level: ${data.codeDetail.toUpperCase()}.`);
  }
  
  if (formatRules.length > 0 || data.responseStructure) {
    parts.push(`\n# RESPONSE FORMAT`);
    if (formatRules.length > 0) {
      parts.push(formatRules.join("\n"));
    }
    if (data.responseStructure) {
      parts.push(`Structure your response exactly like this:\n${data.responseStructure}`);
    }
  }

  // 3. Menu
  if (data.enableMenu) {
    parts.push(`\n# MENU SYSTEM`);
    if (data.menuTrigger) {
      parts.push(`When the user says "${data.menuTrigger}", present the following menu.`);
    }
    if (data.menuTitle) {
      parts.push(`${data.name}: ${data.menuTitle}`);
    }
    
    if (data.menuCategories.length > 0) {
      data.menuCategories.forEach(cat => {
        parts.push(`\n${cat.name}`);
        cat.items.forEach(item => {
          parts.push(`- ${item.name}`);
        });
      });
    }
  }

  // 4. Triggers
  if (data.triggers && data.triggers.length > 0) {
    parts.push(`\n# TRIGGER PHRASES`);
    data.triggers.forEach(t => {
      parts.push(`If user says "${t.phrase}" -> ${t.action}`);
    });
  }

  // 5. User Profile
  if (data.userAlias || data.userDescription || data.queryStyle) {
    parts.push(`\n# USER PROFILE`);
    if (data.userAlias) {
      parts.push(`Refer to the user as: "${data.userAlias}"`);
    }
    if (data.userDescription) {
      parts.push(`User context: ${data.userDescription}`);
    }
    if (data.queryStyle) {
      parts.push(`Query style notes: ${data.queryStyle}`);
    }
  }

  // 6. Rules
  const rules = [];
  if (data.neverBreak4thWall) {
    rules.push(`- NEVER break the 4th wall (no AI/model/training references).`);
  }
  if (data.forbiddenTopics) {
    rules.push(`- Forbidden topics: ${data.forbiddenTopics}`);
  }
  if (data.customRules) {
    rules.push(...data.customRules.split('\n').map(r => r.trim()).filter(Boolean).map(r => `- ${r}`));
  }

  if (rules.length > 0) {
    parts.push(`\n# RULES & CONSTRAINTS`);
    parts.push(rules.join("\n"));
  }

  return parts.join("\n").trim();
}
