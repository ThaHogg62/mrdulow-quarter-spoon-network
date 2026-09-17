import React, { Component, ReactNode, ErrorInfo } from 'react';

/**
 * Pre-flight client WebGL support detector
 */
export const checkWebGLSupport = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      (canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false }) as WebGLRenderingContext | null);
    if (!gl || gl.isContextLost()) return false;
    // Release the test context immediately so we never exhaust browser WebGL slots
    const loseCtx = gl.getExtension('WEBGL_lose_context');
    if (loseCtx) {
      loseCtx.loseContext();
    }
    return true;
  } catch {
    return false;
  }
};

export const isWebGLAvailable = checkWebGLSupport;

interface Props {
  children: ReactNode;
  fallbackImage?: string;
  fallbackImageSrc?: string;
}

interface State {
  hasError: boolean;
}

/**
 * WebGLFallbackBoundary Component
 * Catches WebGLRenderer context creation failure and gracefully renders 2D static hero fallback
 */
export class WebGLFallbackBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo?: ErrorInfo) {
    console.warn('WebGL Context Failure caught by boundary:', error);
  }

  public render() {
    const imageSrc = this.props.fallbackImage || this.props.fallbackImageSrc || '/HOME PAGE.jpeg';

    if (this.state.hasError) {
      return (
        <div className="relative w-full h-full min-h-[380px] bg-black/60 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/15 p-4">
          <img
            src={imageSrc}
            alt="Quarter Spoon Network Hero Fallback"
            className="w-full h-full max-h-[350px] object-contain mb-3"
          />
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-lg bg-[#0044FF] text-white font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          >
            RESTORE 3D ENGINE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebGLFallbackBoundary;
