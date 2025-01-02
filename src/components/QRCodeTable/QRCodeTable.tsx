'use client';

import { memo, useEffect, useRef } from 'react';

import QRCode from 'qrcode';

import { getTableLink } from '@/utilities';

interface QRCodeTableProps {
    token: string;
    tableNumber: number;
    width?: number;
}

const QRCodeTable = ({ token, tableNumber, width = 250 }: QRCodeTableProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const qrCanvas = document.createElement('canvas');
        const canvas = canvasRef.current!;
        canvas.height = width + 70;
        canvas.width = width;
        // const qrContext = qrCanvas.getContext('2d')!
        const canvasContext = canvas.getContext('2d')!;
        canvasContext.fillStyle = '#fff';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        canvasContext.font = '20px Arial';
        canvasContext.textAlign = 'center';
        canvasContext.fillStyle = '#000';
        canvasContext.fillText(`Bàn số ${tableNumber}`, width / 2, width + 20);
        canvasContext.fillText('Quét mã QR để gọi món', width / 2, width + 50);

        const qrCanvasOptions = {
            width,
            margin: 4,
        };
        const qrCanvasLinkText = getTableLink({
            token,
            tableNumber,
        });
        const qrCanvasCallback = (error: Error | null | undefined) => {
            if (error) console.error(error);
            canvasContext.drawImage(qrCanvas, 0, 0, width, width);
        };

        QRCode.toCanvas(qrCanvas, qrCanvasLinkText, qrCanvasOptions, qrCanvasCallback);
    }, [token, tableNumber, width]);

    return <canvas ref={canvasRef} />;
};

export default memo(QRCodeTable);
