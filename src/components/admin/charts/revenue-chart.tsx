'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  title?: string;
  height?: number;
}

export default function RevenueChart({ 
  data, 
  title = "Gelir Analizi", 
  height = 300 
}: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxOrders = Math.max(...data.map(d => d.orders));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">₺</span>
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Revenue Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Gelir Trendi</h4>
            <div className="relative h-32">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="absolute bottom-0 flex flex-col items-center"
                  style={{
                    left: `${(index / (data.length - 1)) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div
                    className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                    style={{
                      height: `${(item.revenue / maxRevenue) * 100}%`
                    }}
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    {item.date.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))}
              </p>
              <p className="text-xs text-gray-500">Toplam Gelir</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {data.reduce((sum, d) => sum + d.orders, 0)}
              </p>
              <p className="text-xs text-gray-500">Toplam Sipariş</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0) / data.reduce((sum, d) => sum + d.orders, 0))}
              </p>
              <p className="text-xs text-gray-500">Ortalama Sepet</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}