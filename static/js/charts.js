// Simple Chart Library - Pure JavaScript
// No external dependencies

class SimpleChart {
    constructor(canvasId, type = 'doughnut') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id ${canvasId} not found`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.type = type;
        this.data = null;
        this.colors = [
            '#007AFF', // primary
            '#34C759', // success
            '#FF9500', // warning
            '#FF3B30', // danger
            '#5856D6', // secondary
            '#00C7BE', // teal
            '#FF2D55', // pink
            '#AF52DE'  // purple
        ];
    }

    drawDoughnutChart(data, options = {}) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 10;
        const innerRadius = radius * 0.6;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Calculate total
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        if (total === 0) {
            this.drawNoData(centerX, centerY);
            return;
        }

        let currentAngle = -Math.PI / 2; // Start at top

        // Draw segments
        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            // Draw slice
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            this.ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            this.ctx.closePath();
            this.ctx.fillStyle = item.color || this.colors[index % this.colors.length];
            this.ctx.fill();

            // Draw percentage in center of slice if significant
            if (item.value / total > 0.05) {
                const midAngle = currentAngle + sliceAngle / 2;
                const labelRadius = (radius + innerRadius) / 2;
                const labelX = centerX + Math.cos(midAngle) * labelRadius;
                const labelY = centerY + Math.sin(midAngle) * labelRadius;
                
                const percentage = Math.round((item.value / total) * 100);
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = 'bold 14px Inter, sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(`${percentage}%`, labelX, labelY);
            }

            currentAngle += sliceAngle;
        });

        // Draw center circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#F2F2F7';
        this.ctx.fill();

        // Draw total in center
        this.ctx.fillStyle = '#1C1C1E';
        this.ctx.font = 'bold 24px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(total, centerX, centerY - 8);
        
        this.ctx.fillStyle = '#8E8E93';
        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.fillText('Total', centerX, centerY + 12);

        // Draw legend
        this.drawLegend(data, width, height);
    }

    drawBarChart(data, options = {}) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        if (data.length === 0) {
            this.drawNoData(width / 2, height / 2);
            return;
        }

        const maxValue = Math.max(...data.map(d => d.value));
        const barWidth = chartWidth / data.length - 10;
        const spacing = 10;

        // Draw bars
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + spacing);
            const y = height - padding - barHeight;

            // Draw bar with gradient
            const gradient = this.ctx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, item.color || this.colors[index % this.colors.length]);
            gradient.addColorStop(1, this.adjustColor(item.color || this.colors[index % this.colors.length], -20));
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, barWidth, barHeight);

            // Draw value on top
            this.ctx.fillStyle = '#1C1C1E';
            this.ctx.font = 'bold 12px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.value, x + barWidth / 2, y - 5);

            // Draw label
            this.ctx.fillStyle = '#8E8E93';
            this.ctx.font = '10px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            const label = item.label.length > 12 ? item.label.substring(0, 10) + '...' : item.label;
            this.ctx.fillText(label, x + barWidth / 2, height - padding + 15);
        });

        // Draw axis
        this.ctx.strokeStyle = '#D1D1D6';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, height - padding);
        this.ctx.lineTo(width - padding, height - padding);
        this.ctx.stroke();
    }

    drawLineChart(data, options = {}) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        if (data.length === 0) {
            this.drawNoData(width / 2, height / 2);
            return;
        }

        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = 0;
        const range = maxValue - minValue;
        const stepX = chartWidth / (data.length - 1);

        // Draw grid
        this.ctx.strokeStyle = '#E5E5EA';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(width - padding, y);
            this.ctx.stroke();
        }

        // Draw line
        this.ctx.strokeStyle = options.color || '#007AFF';
        this.ctx.lineWidth = 3;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        data.forEach((item, index) => {
            const x = padding + index * stepX;
            const y = height - padding - ((item.value - minValue) / range) * chartHeight;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.stroke();

        // Draw points and labels
        data.forEach((item, index) => {
            const x = padding + index * stepX;
            const y = height - padding - ((item.value - minValue) / range) * chartHeight;
            
            // Draw point
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fill();
            this.ctx.strokeStyle = options.color || '#007AFF';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Draw value
            this.ctx.fillStyle = '#1C1C1E';
            this.ctx.font = 'bold 11px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.value, x, y - 12);

            // Draw label
            if (index % Math.ceil(data.length / 6) === 0) {
                this.ctx.fillStyle = '#8E8E93';
                this.ctx.font = '10px Inter, sans-serif';
                this.ctx.textAlign = 'center';
                const label = item.label.length > 8 ? item.label.substring(0, 6) + '...' : item.label;
                this.ctx.fillText(label, x, height - padding + 15);
            }
        });

        // Draw axes
        this.ctx.strokeStyle = '#D1D1D6';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height - padding);
        this.ctx.lineTo(width - padding, height - padding);
        this.ctx.stroke();
    }

    drawLegend(data, width, height) {
        const legendX = 10;
        const legendY = height - data.length * 20 - 10;
        
        data.forEach((item, index) => {
            const y = legendY + index * 20;
            
            // Draw color box
            this.ctx.fillStyle = item.color || this.colors[index % this.colors.length];
            this.ctx.fillRect(legendX, y, 12, 12);
            
            // Draw label
            this.ctx.fillStyle = '#1C1C1E';
            this.ctx.font = '11px Inter, sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
            const label = item.label.length > 15 ? item.label.substring(0, 13) + '...' : item.label;
            this.ctx.fillText(label, legendX + 18, y + 6);
        });
    }

    drawNoData(x, y) {
        this.ctx.fillStyle = '#8E8E93';
        this.ctx.font = '14px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Sem dados disponíveis', x, y);
    }

    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }

    render(data, options = {}) {
        this.data = data;
        
        // Set canvas size
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        switch (this.type) {
            case 'doughnut':
                this.drawDoughnutChart(data, options);
                break;
            case 'bar':
                this.drawBarChart(data, options);
                break;
            case 'line':
                this.drawLineChart(data, options);
                break;
        }
    }
}
