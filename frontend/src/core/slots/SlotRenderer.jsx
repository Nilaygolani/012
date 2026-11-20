import React from 'react';
import { getModulesBySlot } from './moduleRegistry';
import { SafeModuleWrapper } from './SafeModuleWrapper';

export default function SlotRenderer({ name, className = '', fallback = null }) {
  const modules = getModulesBySlot(name);

  if (!modules || modules.length === 0) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  return (
    <div className={`slot-container slot-${name} ${className}`}>
      {modules.map((mod) => {
        const Component = mod.component;
        return (
          <SafeModuleWrapper key={mod.id} moduleId={mod.id}>
            <Component />
          </SafeModuleWrapper>
        );
      })}
    </div>
  );
}

