import React from 'react';
import { render, screen } from '@testing-library/react';
import MatrixRain from '../components/MatrixRain';

describe('MatrixRain Component', () => {
  const defaultProps = {
    isPlaying: true,
    speed: 2,
    density: 1,
    color: '#00ff00',
    soundEnabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<MatrixRain {...defaultProps} />);
    const canvas = screen.getByRole('presentation');
    expect(canvas).toBeInTheDocument();
  });

  it('should render canvas with correct styles', () => {
    render(<MatrixRain {...defaultProps} />);
    const canvas = screen.getByRole('presentation');
    
    expect(canvas).toHaveStyle({
      position: 'absolute',
      inset: '0px',
      width: '100%',
      height: '100%'
    });
  });

  it('should show performance stats in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(<MatrixRain {...defaultProps} />);
    
    // Performance stats should be visible in development
    expect(screen.getByText(/FPS:/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should hide performance stats in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(<MatrixRain {...defaultProps} />);
    
    // Performance stats should be hidden in production
    expect(screen.queryByText(/FPS:/)).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle different color props', () => {
    const { rerender } = render(<MatrixRain {...defaultProps} color="#00ffff" />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    
    rerender(<MatrixRain {...defaultProps} color="#ff00ff" />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('should handle isPlaying state changes', () => {
    const { rerender } = render(<MatrixRain {...defaultProps} isPlaying={false} />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    
    rerender(<MatrixRain {...defaultProps} isPlaying={true} />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('should handle speed changes', () => {
    const { rerender } = render(<MatrixRain {...defaultProps} speed={5} />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    
    rerender(<MatrixRain {...defaultProps} speed={0.5} />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('should handle density changes', () => {
    const { rerender } = render(<MatrixRain {...defaultProps} density={2} />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    
    rerender(<MatrixRain {...defaultProps} density={0.1} />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('should handle sound enabled changes', () => {
    const { rerender } = render(<MatrixRain {...defaultProps} soundEnabled={true} />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    
    rerender(<MatrixRain {...defaultProps} soundEnabled={false} />);
    
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });
});