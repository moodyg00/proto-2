import { tool } from 'ai';
import { z } from 'zod';
import { memoryService } from './service';

export const memorySearchTool = tool({
  description: 'Search an agent\'s memory for relevant facts, scenes, or persona context.',
  parameters: z.object({
    agentId: z.string(),
    query: z.string(),
    limit: z.number().default(15),
  }),
  async execute({ agentId, query, limit }) {
    const results = await memoryService.searchMemories(agentId, query, limit);
    return { count: results.length, results };
  },
});

export const memoryLogStrategicEventTool = tool({
  description: 'Log a high-value strategic event into long-term memory (L1-L3).',
  parameters: z.object({
    agentId: z.string(),
    content: z.string(),
    level: z.number().min(1).max(3).default(2),
  }),
  async execute({ agentId, content, level }) {
    const evt = await memoryService.logStrategicEvent(agentId, content, level as 1 | 2 | 3);
    return { success: true, id: evt.id };
  },
});

export const memoryGetPersonaTool = tool({
  description: 'Get the current persona and tuning for an agent.',
  parameters: z.object({ agentId: z.string() }),
  async execute({ agentId }) {
    return memoryService.getPersona(agentId);
  },
});

export const memoryUpdatePersonaTool = tool({
  description: 'Update an agent\'s persona, goals, tone or tuning parameters.',
  parameters: z.object({
    agentId: z.string(),
    updates: z.record(z.any()),
  }),
  async execute({ agentId, updates }) {
    const p = await memoryService.updatePersona(agentId, updates);
    return { success: true, persona: p };
  },
});

export const memoryGetSettingsTool = tool({
  description: 'Get current memory recall and tuning settings for an agent.',
  parameters: z.object({ agentId: z.string() }),
  async execute({ agentId }) {
    return memoryService.getSettings(agentId);
  },
});

export const memoryUpdateSettingsTool = tool({
  description: 'Update memory system settings (recall strategy, compression, etc.).',
  parameters: z.object({
    agentId: z.string(),
    updates: z.record(z.any()),
  }),
  async execute({ agentId, updates }) {
    const s = await memoryService.updateSettings(agentId, updates);
    return { success: true, settings: s };
  },
});

export const allMemoryTools = {
  memory_search: memorySearchTool,
  memory_log_strategic_event: memoryLogStrategicEventTool,
  memory_get_persona: memoryGetPersonaTool,
  memory_update_persona: memoryUpdatePersonaTool,
  memory_get_settings: memoryGetSettingsTool,
  memory_update_settings: memoryUpdateSettingsTool,
};
