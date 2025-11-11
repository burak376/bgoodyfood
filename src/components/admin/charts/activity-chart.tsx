'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActivityChartProps {
  data: Array<{
    time: string;
    users: number;
    orders: number;
    pageViews: number;
  }>;
  title?: string;
  height?: number;
}

export default function ActivityChart({ 
  data, 
  title = "Aktivite Analizi", 
  height = 300 
}: ActivityChartProps) {
  const maxUsers = Math.max(...data.map(d => d.users));
  const maxOrders = Math.max(...data.map(d => d.orders));
  const maxPageViews = Math.max(...data.map(d => d.pageViews));

  const getActivityLevel = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage > 80) return { level: 'Yüksek', color: 'bg-green-500' };
    if (percentage > 50) return { level: 'Orta', color: 'bg-yellow-500' };
    return { level: 'Düşük', color: 'bg-red-500' };
  };

  const latestData = data[data.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">📈</span>
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {latestData?.users || 0}
              </div>
              <p className="text-xs text-gray-500">Aktif Kullanıcı</p>
              <Badge 
                variant="outline" 
                className={`mt-1 ${getActivityLevel(latestData?.users || 0, maxUsers).color} text-white`}
              >
                {getActivityLevel(latestData?.users || 0, maxUsers).level}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {latestData?.orders || 0}
              </div>
              <p className="text-xs text-gray-500">Sipariş</p>
              <Badge 
                variant="outline" 
                className={`mt-1 ${getActivityLevel(latestData?.orders || 0, maxOrders).color} text-white`}
              >
                {getActivityLevel(latestData?.orders || 0, maxOrders).level}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {latestData?.pageViews || 0}
              </div>
              <p className="text-xs text-gray-500">Sayfa Görüntüleme</p>
              <Badge 
                variant="outline" 
                className={`mt-1 ${getActivityLevel(latestData?.pageViews || 0, maxPageViews).color} text-white`}
              >
                {getActivityLevel(latestData?.pageViews || 0, maxPageViews).level}
              </Badge>
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">Günlük Aktivite</h4>
            <div className="space-y-3">
              {data.slice(-7).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">K:</span>
                      <span className="text-sm font-medium">{item.users}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">S:</span>
                      <span className="text-sm font-medium">{item.orders}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">SG:</span>
                      <span className="text-sm font-medium">{item.pageViews}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}