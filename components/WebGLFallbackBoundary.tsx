import React, { Component, ReactNode, ErrorInfo } from 'react';

/**
 * Pre-flight client WebGL support detector
 */
export const checkWebGLSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      (canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false }) as WebGLRenderingContext | null);
    return Boolean(gl && !gl.isContextLost());
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
  public state: State;

  constructor(props: Props) {
    super(props);
    const supported = typeof window !== 'undefined' ? checkWebGLSupport() : true;
    this.state = { hasError: !supported };
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo?: ErrorInfo) {
    console.warn('WebGL Context Creation Failed. Triggering 2D Fallback:', error);
  }

  public render() {
    const imageSrc = this.props.fallbackImage || this.props.fallbackImageSrc || '/HOME PAGE.jpeg';

    if (this.state.hasError) {
      return (
        <div className="relative w-full h-full min-h-[380px] bg-black flex items-center justify-center overflow-hidden rounded-2xl border border-white/15">
          <img
            src={imageSrc}
            alt="Quarter Spoon Network Hero"
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebGLFallbackBoundary;
