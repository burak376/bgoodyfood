'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Shield, 
  Zap, 
  Apple,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface NutritionalBadgeProps {
  evaluation?: {
    healthScore: number;
    vitaminScore: number;
    proteinScore: number;
    fiberScore: number;
    aiConfidence?: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export default function NutritionalBadge({
  evaluation,
  size = 'sm',
  showDetails = false,
  className = ''
}: NutritionalBadgeProps) {
  if (!evaluation) {
    return (
      <Badge variant="outline" className={`text-muted-foreground ${className}`}>
        <Info className="w-3 h-3 mr-1" />
        Değerlendirme yok
      </Badge>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-3 h-3" />;
    if (score >= 60) return <AlertTriangle className="w-3 h-3" />;
    return <AlertTriangle className="w-3 h-3" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Mükemmel';
    if (score >= 60) return 'İyi';
    return 'Orta';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (showDetails) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          <Heart className={`${iconSizes[size]} ${getScoreColor(evaluation.healthScore)}`} />
          <span className={`font-medium ${getScoreColor(evaluation.healthScore)}`}>
            Sağlık Skoru: {evaluation.healthScore}/100
          </span>
          <Badge variant="outline" className={getScoreBgColor(evaluation.healthScore)}>
            {getScoreLabel(evaluation.healthScore)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Apple className="w-3 h-3 text-muted-foreground" />
            <span>V: {evaluation.vitaminScore}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-muted-foreground" />
            <span>P: {evaluation.proteinScore}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <span>L: {evaluation.fiberScore}</span>
          </div>
        </div>
        
        <Progress value={evaluation.healthScore} className="h-1" />
        
        {evaluation.aiConfidence && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            <span>AI Güven: {Math.round(evaluation.aiConfidence * 100)}%</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={`${getScoreBgColor(evaluation.healthScore)} ${getScoreColor(evaluation.healthScore)} ${sizeClasses[size]} ${className}`}
    >
      <Heart className={`${iconSizes[size]} mr-1`} />
      {evaluation.healthScore}/100
      {getScoreIcon(evaluation.healthScore)}
    </Badge>
  );
}