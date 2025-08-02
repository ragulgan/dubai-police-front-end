import React from 'react';
import { render, screen } from '@testing-library/react';
import TinyAreaChart from '@/components/charts/TinyAreaChart';
import '@testing-library/jest-dom';

describe('TinyAreaChart', () => {
    it('renders without crashing', () => {
        const { container } = render(<TinyAreaChart />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('renders chart with correct dimensions', () => {
        const { container } = render(<TinyAreaChart />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('500');
        expect(svg?.getAttribute('height')).toBe('300');
    });

    it('renders line and area paths', () => {
        const { container } = render(<TinyAreaChart />);
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBeGreaterThanOrEqual(2);
    });
});
