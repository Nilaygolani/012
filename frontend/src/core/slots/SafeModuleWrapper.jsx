import React, { Component } from 'react';

export class SafeModuleWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn(`[SafeModuleWrapper] Module "${this.props.moduleId || 'unknown'}" encountered an error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.showFallbackNotice) {
        return (
          <div className="p-3 my-2 border border-dashed border-amber-300 bg-amber-50 rounded text-xs text-amber-800">
            Module <strong>{this.props.moduleId}</strong> is currently unavailable.
          </div>
        );
      }
      return null;
    }

    return this.props.children;
  }
}

