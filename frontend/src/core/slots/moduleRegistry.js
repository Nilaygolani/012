// Dynamic Vite Module Auto-Discovery for Plug & Play Architecture
let registeredModules = [];
let moduleStatusMap = {};

export function initializeModules() {
  const discovered = [];
  try {
    const modules = import.meta.glob('../../modules/*/index.{jsx,js}', { eager: true });

    for (const path in modules) {
      const moduleExport = modules[path]?.default;
      if (moduleExport && moduleExport.id && moduleExport.component) {
        discovered.push({
          id: moduleExport.id,
          name: moduleExport.name || moduleExport.id,
          slot: moduleExport.slot || 'custom',
          order: typeof moduleExport.order === 'number' ? moduleExport.order : 50,
          component: moduleExport.component,
          path,
          enabled: true
        });
        moduleStatusMap[moduleExport.id] = true;
      }
    }
  } catch (err) {
    console.error('[ModuleRegistry] Auto-discovery error:', err);
  }

  registeredModules = discovered.sort((a, b) => a.order - b.order);
  return registeredModules;
}

export function getModulesBySlot(slotName) {
  if (registeredModules.length === 0) {
    initializeModules();
  }
  return registeredModules.filter(m => m.slot === slotName && moduleStatusMap[m.id] !== false);
}

export function getAllModules() {
  if (registeredModules.length === 0) {
    initializeModules();
  }
  return registeredModules.map(m => ({
    id: m.id,
    name: m.name,
    slot: m.slot,
    order: m.order,
    enabled: moduleStatusMap[m.id] !== false
  }));
}

