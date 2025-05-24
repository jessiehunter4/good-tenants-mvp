
import { useState, useEffect } from "react";
import { useMarketMetrics } from "./useMarketMetrics";

interface ROIInputs {
  purchasePrice: number;
  downPayment: number;
  monthlyRent: number;
  propertyTaxes: number;
  insurance: number;
  maintenance: number;
  vacancyRate: number;
  managementFee: number;
}

interface ROIMetrics {
  monthlyExpenses: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
  totalROI: number;
  breakEvenRent: number;
  monthsToBreakEven: number;
}

export const useROICalculation = () => {
  const { data: marketData } = useMarketMetrics();
  const [inputs, setInputs] = useState<ROIInputs>({
    purchasePrice: 500000,
    downPayment: 100000,
    monthlyRent: 3500,
    propertyTaxes: 500,
    insurance: 200,
    maintenance: 300,
    vacancyRate: 5,
    managementFee: 8,
  });

  const [metrics, setMetrics] = useState<ROIMetrics | null>(null);

  const calculateROI = (inputs: ROIInputs): ROIMetrics => {
    const loanAmount = inputs.purchasePrice - inputs.downPayment;
    const monthlyMortgage = calculateMortgagePayment(loanAmount, 6.5, 30); // Assuming 6.5% interest, 30 years
    
    const vacancyLoss = (inputs.monthlyRent * inputs.vacancyRate) / 100;
    const managementCost = (inputs.monthlyRent * inputs.managementFee) / 100;
    
    const monthlyExpenses = monthlyMortgage + inputs.propertyTaxes + inputs.insurance + inputs.maintenance + vacancyLoss + managementCost;
    const monthlyCashFlow = inputs.monthlyRent - monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    
    const annualIncome = inputs.monthlyRent * 12;
    const annualExpensesWithoutMortgage = (inputs.propertyTaxes + inputs.insurance + inputs.maintenance + vacancyLoss + managementCost) * 12;
    const netOperatingIncome = annualIncome - annualExpensesWithoutMortgage;
    
    const capRate = (netOperatingIncome / inputs.purchasePrice) * 100;
    const cashOnCashReturn = (annualCashFlow / inputs.downPayment) * 100;
    const totalROI = ((annualCashFlow + (inputs.purchasePrice * 0.03)) / inputs.downPayment) * 100; // Assuming 3% appreciation
    
    const breakEvenRent = monthlyExpenses;
    const monthsToBreakEven = inputs.downPayment / Math.max(monthlyCashFlow, 1);

    return {
      monthlyExpenses,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
      totalROI,
      breakEvenRent,
      monthsToBreakEven,
    };
  };

  const calculateMortgagePayment = (principal: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  useEffect(() => {
    const calculatedMetrics = calculateROI(inputs);
    setMetrics(calculatedMetrics);
  }, [inputs]);

  const updateInput = (field: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const getMarketComparison = () => {
    if (!marketData || !metrics) return null;
    
    return {
      averageRent: marketData.averageRent,
      rentComparison: ((inputs.monthlyRent - marketData.averageRent) / marketData.averageRent) * 100,
      capRateComparison: metrics.capRate > 8 ? "Above Market" : metrics.capRate > 6 ? "Market Rate" : "Below Market",
    };
  };

  return {
    inputs,
    metrics,
    updateInput,
    marketComparison: getMarketComparison(),
    setInputs,
  };
};
